const schemas = require("../../schemas");
const BaseModel = require("./base-model");

class Payment extends BaseModel {
  static get tableName() {
    return "payments";
  }

  static get jsonSchema() {
    return schemas.types.payment;
  }

  static get relationMappings() {
    return {
      course: {
        modelClass: "course",
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "payments.course_id",
          to: "courses.id",
        },
      },
      student: {
        modelClass: "student",
        relation: BaseModel.BelongsToOneRelation,
        join: {
          from: "payments.student_id",
          to: "students.id",
        },
      },
    };
  }
}

module.exports = Payment;
