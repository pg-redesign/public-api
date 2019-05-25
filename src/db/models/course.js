const TimestampsBase = require("./timestamps-base");

class Course extends TimestampsBase {
  static get tableName() {
    return "courses";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "price", "start_date", "end_date", "location"],
      properties: {
        name: { type: "string" },
        price: { type: "integer" },
        start_date: { type: "string", format: "date-time" },
        end_date: { type: "string", format: "date-time" },
        location: {
          required: ["city", "state", "country", "map_url"],
          city: { type: "string" },
          state: { type: "string" },
          country: { type: "string" },
          map_url: { type: "string" },
        },
      },
    };
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
