const { NotFoundError, ValidationError } = require("objection");

const Student = require("./student");
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

  static async validateCourseID(courseID) {
    const course = await this.query().findById(courseID);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    if (course.startDate > new Date().toUTCString()) {
      throw new ValidationError({
        courseID: "Course is past registration deadline",
      });
    }
  }

  static async registerStudent(registrationData) {
    const { paymentType, courseID, ...studentData } = registrationData;

    // ensures the course is valid for registration
    await this.validateCourseID(courseID);

    return Student.query().insert({
      ...studentData,
      type: paymentType,
      invoiceDate: new Date().toISOString(),
    });
  }

  static get jsonSchema() {
    return schemas.types.course;
  }

  static get relationMappings() {
    return {
      students: {
        relation: Model.ManyToManyRelation,
        /* eslint global-require:0 */
        modelClass: require("./student"),
        join: {
          from: "courses.id",
          to: "students.id",
          through: {
            from: "courses.id",
            to: "payments.course_id",
            extra: ["type", "invoice_date", "payment_date"],
          },
        },
      },
    };
  }
}

Course.DEFAULT_SORT = DEFAULT_SORT;
module.exports = Course;
