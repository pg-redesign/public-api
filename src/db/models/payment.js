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
        relation: Model.BelongsToOneRelation,
        /* eslint global-require:0 */
        modelClass: require("./course"),
        join: {
          from: "course_id",
          to: "courses.id",
        },
      },
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./student"),
        join: {
          from: "student_id",
          to: "students.id",
        },
      },
    };
  }
}

module.exports = Payment;
