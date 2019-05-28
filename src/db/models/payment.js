const { Model } = require("../connection");
const schemas = require("../../schemas");
const TimestampsBase = require("./timestamps-base");

class Payment extends TimestampsBase {
  static get tableName() {
    return "payments";
  }

  static get jsonSchema() {
    return schemas.types.payment;
  }

  static get relationMappings() {
    return {
      course: {
        modelClass: "Course",
        relation: Model.BelongsToOneRelation,
        join: {
          from: "payments.course_id",
          to: "courses.id",
        },
      },
      student: {
        modelClass: "Student",
        relation: Model.BelongsToOneRelation,
        join: {
          from: "payments.student_id",
          to: "students.id",
        },
      },
    };
  }
}

module.exports = Payment;
