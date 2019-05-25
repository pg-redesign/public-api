const TimestampsBase = require("./timestamps-base");

class Student extends TimestampsBase {
  static get tableName() {
    return "students";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["first_name", "last_name", "email", "company", "location"],
      properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        email: { type: "string", format: "email" },
        company: { type: "string" },
        location: {
          required: ["city", "state", "country"],
          city: { type: "string" },
          state: { type: "string" },
          country: { type: "string" },
        },
      },
    };
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
