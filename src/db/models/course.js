const { Model } = require("../connection");
const schemas = require("../../schemas");
const TimestampsBase = require("./timestamps-base");

class Course extends TimestampsBase {
  static get tableName() {
    return "courses";
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

module.exports = Course;
