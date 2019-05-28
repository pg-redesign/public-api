const { NotFoundError, ValidationError } = require("objection");

const schemas = require("../../schemas");
const { Model } = require("../connection");
const TimestampsBase = require("./timestamps-base");

const DEFAULT_SORT = ["start_date", "desc"];

class Course extends TimestampsBase {
  static get tableName() {
    return "courses";
  }

  static getAll() {
    return this.query().orderBy(...DEFAULT_SORT);
  }

  static getUpcoming() {
    return (
      this.query()
        .orderBy(...DEFAULT_SORT)
        // only return courses that are upcoming (beyond current date)
        .where("start_date", ">", new Date().toUTCString())
        .limit(2)
    );
  }

  static async validateCourseId(courseId) {
    const course = await this.query()
      .findById(courseId)
      .select(["id", "start_date", "price"]);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (course.startDate > new Date().toUTCString()) {
      throw new ValidationError({
        courseId: "Course is past registration deadline",
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
      paymentType,
      ...partialStudent
    } = registrationData;

    // ensures the course is valid for registration
    const course = await this.validateCourseId(courseId);

    return course.$relatedQuery("students").insert({
      // student registration data without city, state, country
      ...partialStudent,
      // shape into student location object
      location: { city, state, country },
      // (extra) payment fields
      amount: course.price,
      paymentType,
      invoiceDate: new Date().toISOString(),
    });
  }

  static get jsonSchema() {
    return schemas.types.course;
  }

  static get relationMappings() {
    return {
      payments: {
        modelClass: "Payment",
        relation: Model.HasManyRelation,
        join: {
          from: "courses.id",
          to: "payments.course_id",
        },
      },
      students: {
        modelClass: "Student",
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
            },
          },
        },
      },
    };
  }
}

Course.DEFAULT_SORT = DEFAULT_SORT;
module.exports = Course;
