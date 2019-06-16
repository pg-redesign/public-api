const { ValidationError } = require("objection");

const Student = require("./student");
const schemas = require("../../schemas");
const { Model } = require("../connection");
const TimestampsBase = require("./timestamps-base");

const DEFAULT_SORT = ["start_date", "desc"];

class Course extends TimestampsBase {
  static get tableName() {
    return "courses";
  }

  static get jsonSchema() {
    return schemas.types.course;
  }

  static get relationMappings() {
    return {
      payments: {
        modelClass: "payment",
        relation: Model.HasManyRelation,
        join: {
          from: "courses.id",
          to: "payments.course_id",
        },
      },
      students: {
        modelClass: "student",
        relation: Model.ManyToManyRelation,
        join: {
          from: "courses.id",
          to: "students.id",
          through: {
            from: "payments.course_id",
            to: "payments.student_id",
            extra: {
              amount: "amount",
              paymentType: "payment_type",
              invoiceDate: "invoice_date",
              paymentDate: "payment_date",
              confirmationId: "confirmation_id",
            },
          },
        },
      },
    };
  }

  // -- STATIC METHODS -- //

  static getAll() {
    return this.query().orderBy(...DEFAULT_SORT);
  }

  static getUpcoming() {
    return (
      this.query()
        .orderBy(...DEFAULT_SORT)
        // only return courses that are upcoming (beyond current date)
        .where("start_date", ">", new Date())
        .limit(2)
    );
  }

  static async validateCourseId(courseId) {
    const course = await this.query()
      .findById(courseId)
      .select(["id", "start_date", "price"])
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

    // ensures the course is valid for registration
    const course = await this.validateCourseId(courseId);

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

    const course = await this.query()
      .findById(courseId)
      .select(["id", "price", "name"])
      .throwIfNotFound();

    // throws if not found (student not registered)
    const registeredStudent = await course.getRegisteredStudent(studentId, [
      "payment_date",
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
      .where("student_id", studentId)
      .first()
      .throwIfNotFound();

    if (columns.length) query.select(columns);

    return query;
  }

  async hasStudent(studentId) {
    const result = await this.$relatedQuery("payments")
      .select("payments.student_id")
      .where("student_id", studentId);

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
      student_id: student.id,
      ...paymentData,
    });

    return updatedStudent;
  }
}

Course.DEFAULT_SORT = DEFAULT_SORT;
module.exports = Course;
