const Model = require("../connection");
const { studentSchema } = require("../schemas");
const TimestampsBase = require("./timestamps-base");

class Student extends TimestampsBase {
  static get tableName() {
    return "students";
  }

  static get jsonSchema() {
    return studentSchema;
  }

  static get relationMappings() {
    return {
      students: {
        relation: Model.ManyToManyRelation,
        /* eslint global-require:0 */
        modelClass: require("./course"),
        join: {
          to: "courses.id",
          from: "students.id",
          through: {
            from: "students.id",
            to: "payments.student_id",
            extra: ["type", "invoice_date", "payment_date"],
          },
        },
      },
    };
  }
}

module.exports = Student;
