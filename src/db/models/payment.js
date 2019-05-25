const Model = require("../connection");

class Payment extends Model {
  static get tableName() {
    return "payments";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["type", "amount", "invoice_date", "course_id", "student_id"],
      properties: {
        amount: { type: "integer" },
        course_id: { type: "integer" },
        student_id: { type: "integer" },
        type: { enum: ["credit", "check"] },
        invoice_date: { type: "string", format: "date-time" },
        payment_date: { type: "string", format: "date-time" },
      },
    };
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
