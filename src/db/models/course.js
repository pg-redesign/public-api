const { ValidationError } = require("objection");

const Student = require("./student");
const schemas = require("../../schemas");
const BaseModel = require("./base-model");

const DEFAULT_SORT = ["startDate", "desc"];

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

    return this.query().insert(courseData);
  }

  static getAll(columns = []) {
    return this.query()
      .select(columns)
      .orderBy(...DEFAULT_SORT);
  }

  static getUpcoming(columns = []) {
    return (
      this.query()
        .select(columns)
        .orderBy(...DEFAULT_SORT)
        // only return courses that are upcoming (beyond current date)
        .where("startDate", ">", new Date())
        .limit(2)
    );
  }

  static async validateCourseId(courseId, columns = []) {
    const course = await this.query()
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

    const course = await this.validateCourseId(courseId, [
      "id",
      "startDate",
      "price",
    ]);

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
    const existingStudent = await Student.query()
      .findOne("email", partialStudent.email)
      .select("id");

    const student = existingStudent
      ? await course.registerExistingStudent(
        existingStudent,
        studentData,
        paymentData,
      )
      : await course.registerNewStudent(studentData, paymentData);

    return { course, student };
  }

  static async completeStripePayment(paymentData, stripeService) {
    const { courseId, studentId } = paymentData;

    const course = await this.validateCourseId(courseId, [
      "id",
      "price",
      "name",
    ]);

    // throws if not found (student not registered)
    const registeredStudent = await course.getRegisteredStudent(studentId, [
      "paymentDate",
    ]);

    if (registeredStudent.paymentDate) {
      // student has already paid, exit early
      return registeredStudent;
    }

    const confirmationId = await stripeService.createCharge(
      course,
      paymentData,
    );

    //
    const student = await course.completeStudentRegistration(
      studentId,
      confirmationId,
      schemas.enums.PaymentTypes.credit,
    );

    return { course, student };
  }

  // -- INSTANCE METHODS -- //

  getLocation(columns = []) {
    return this.$relatedQuery("location").select(columns);
  }

  completeStudentRegistration(studentId, confirmationId, paymentType) {
    return this.$relatedQuery("students").patchAndFetchById(studentId, {
      paymentType,
      confirmationId,
      paymentDate: new Date().toISOString(),
    });
  }

  getRegisteredStudent(studentId, columns = []) {
    // throws if not registered
    const query = this.$relatedQuery("students")
      .where("studentId", studentId)
      .select(columns)
      .first()
      .throwIfNotFound();

    return query;
  }

  async hasStudent(studentId) {
    const result = await this.$relatedQuery("payments")
      .select("payments.studentId")
      .where("studentId", studentId);

    return Boolean(result.length);
  }

  registerNewStudent(studentData, paymentData) {
    return this.$relatedQuery("students").insert({
      ...studentData,
      ...paymentData,
    });
  }

  async registerExistingStudent(student, studentData, paymentData) {
    if (await this.hasStudent(student.id)) {
      throw new ValidationError({
        type: "ExistingRelation",
        message: "Student already registered",
      });
    }

    // update student info
    const updatedStudent = await Student.query().updateAndFetchById(
      student.id,
      studentData,
    );

    // create payment association
    await this.$relatedQuery("payments").insert({
      studentId: student.id,
      ...paymentData,
    });

    return updatedStudent;
  }
}

Course.DEFAULT_SORT = DEFAULT_SORT;
module.exports = Course;
