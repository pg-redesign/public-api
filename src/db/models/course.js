const { ValidationError } = require("objection");

const Student = require("./student");
const schemas = require("../../schemas");
const BaseModel = require("./base-model");

const DEFAULT_SORT = ["startDate", "asc"];

class Course extends BaseModel {
  static get tableName() {
    return "courses";
  }

  static get jsonSchema() {
    return schemas.types.course;
  }

  static get relationMappings() {
    return {
      location: {
        modelClass: "course-location",
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "courses.courseLocationId",
          to: "courseLocations.id",
        },
      },
      payments: {
        modelClass: "payment",
        relation: BaseModel.HasManyRelation,
        join: {
          from: "courses.id",
          to: "payments.courseId",
        },
      },
      students: {
        modelClass: "student",
        relation: BaseModel.ManyToManyRelation,
        join: {
          from: "courses.id",
          to: "students.id",
          through: {
            from: "payments.courseId",
            to: "payments.studentId",
            extra: {
              amount: "amount",
              paymentType: "paymentType",
              invoiceDate: "invoiceDate",
              paymentDate: "paymentDate",
              confirmationId: "confirmationId",
            },
          },
        },
      },
    };
  }

  // -- STATIC METHODS -- //
  static create(rawData) {
    const courseData = {
      ...rawData,
      endDate: new Date(rawData.endDate).toISOString(),
      startDate: new Date(rawData.startDate).toISOString(),
    };

    return super.create(courseData);
  }

  static async getAll(columns = []) {
    return this.query()
      .select(columns)
      .orderBy(...DEFAULT_SORT);
  }

  static async getUpcoming(columns = []) {
    return this.query()
      .select(columns)
      .orderBy(...DEFAULT_SORT)
      .where("startDate", ">", new Date()) // courses that are upcoming (beyond current date)
      .limit(2);
  }

  static async validateCourseId(courseId, columns = [], relations = {}) {
    const course = await this.query()
      .withGraphJoined(relations)
      .findById(courseId)
      .select(columns)
      .throwIfNotFound();

    if (course.startDate < new Date()) {
      throw new ValidationError({
        // TODO: replace with objection-db-errors plugin
        type: "InvalidRelation",
        data: { courseId: "Course is past registration deadline" },
      });
    }

    return course;
  }

  static async registerStudent(registrationData) {
    const {
      city,
      state,
      country,
      courseId,
      ...partialStudent
    } = registrationData;

    const course = await this.validateCourseId(courseId, [], {
      location: true,
    });

    // shape location property
    const studentData = {
      ...partialStudent,
      location: { city, state, country },
    };

    const paymentData = {
      amount: course.price,
      invoiceDate: new Date().toISOString(),
    };

    // check for an existing student in the system with the given email
    const existingStudent = await Student.getBy(
      { email: partialStudent.email },
      ["id", "mailingList"],
    );

    const student = existingStudent
      ? await course.registerExistingStudent(
          existingStudent,
          studentData,
          paymentData,
        )
      : await course.registerNewStudent(studentData, paymentData);

    return { course, student };
  }

  static async completeStripePayment(paymentData, context) {
    const { services } = context;
    const { courseId, studentId } = paymentData;

    const course = await this.validateCourseId(courseId, [
      "id",
      "name",
      "price",
    ]);

    // throws if not found (student not registered)
    const registeredStudent = await course.getRegisteredStudent(studentId);

    if (registeredStudent.paymentDate) {
      // student has already paid, exit early
      throw new ValidationError({
        type: "ExistingRelation",
        message: "Payment already received",
      });
      // return { course, student: registeredStudent };
    }

    const confirmationId = await services.stripe.createCharge(
      course,
      paymentData,
    );

    const student = await course.completeStudentRegistration(
      studentId,
      confirmationId,
      schemas.enums.PaymentTypes.credit,
    );

    return { course, student };
  }

  // abstraction for duplicated payment filters logic in getStudents, getPayments
  static applyPaymentFilters(paymentFilters, baseQuery) {
    if (!paymentFilters) return baseQuery;

    const { paymentComplete, paymentType } = paymentFilters;

    if (paymentType) baseQuery.where({ paymentType });

    if (paymentComplete === true) {
      baseQuery.whereNotNull("paymentDate");
    } else if (paymentComplete === false) {
      baseQuery.whereNull("paymentDate");
    }

    return baseQuery;
  }

  // -- INSTANCE METHODS -- //

  async getLocation(columns = []) {
    return this.$relatedQuery("location").select(columns);
  }

  async getStudents(filters = {}, studentColumns = []) {
    // apply payment filters, appends to and returns QueryBuilder instance
    const query = Course.applyPaymentFilters(
      filters.paymentFilters,
      this.$relatedQuery("students").select(studentColumns),
    );

    return query;
  }

  async getPayments(filters = {}, paymentColumns = []) {
    // apply payment filters, appends to and returns QueryBuilder instance
    const query = Course.applyPaymentFilters(
      filters.paymentFilters,
      this.$relatedQuery("payments").select(paymentColumns),
    );

    return query;
  }

  // throws if not registered
  async getRegisteredStudent(studentId, columns = []) {
    return this.$relatedQuery("students")
      .where("studentId", studentId)
      .select(columns)
      .first()
      .throwIfNotFound();
  }

  async hasStudent(studentId) {
    const result = await this.$relatedQuery("students")
      .where({ studentId })
      .resultSize();

    return Boolean(result);
  }

  async registerNewStudent(studentData, paymentData) {
    return this.$relatedQuery("students").insert({
      ...studentData,
      ...paymentData,
    });
  }

  async registerExistingStudent(student, studentData, paymentData) {
    // update student information (in case any has changed)
    const updatedStudent = await Student.query().updateAndFetchById(
      student.id,
      {
        ...studentData,
        // if they are already on the list leave true
        // for returning students who forget to flip mailing list switch on registration
        // otherwise update from current choice in registration data
        mailingList: student.mailingList || studentData.mailingList,
      },
    );

    // check if the student has an association with the course through a payment
    const payment = await updatedStudent.getCoursePayment(this.id, [
      "paymentDate",
    ]);

    if (!payment) {
      // student is not associated with course yet
      await this.$relatedQuery("payments").insert({
        studentId: student.id,
        ...paymentData,
      });
    } else if (payment.paymentDate) {
      // student is associated and payment is already complete
      throw new ValidationError({
        type: "ExistingRelation",
        message: "Student already paid",
      });
    }

    return updatedStudent;
  }

  async completeStudentRegistration(studentId, confirmationId, paymentType) {
    await this.$relatedQuery("payments")
      .where({ studentId })
      .patch({
        paymentType,
        confirmationId,
        paymentDate: new Date().toISOString(),
      });

    return this.$relatedQuery("students")
      .where({ studentId })
      .first();
  }

  update(props) {
    return Course.query()
      .patch(props)
      .where({ id: this.id })
      .returning("*")
      .then(updatedList => updatedList[0]);
  }
}

Course.DEFAULT_SORT = DEFAULT_SORT;
module.exports = Course;
