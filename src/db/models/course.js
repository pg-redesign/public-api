const { Model } = require("../connection");
const schemas = require("../../schemas");
const TimestampsBase = require("./timestamps-base");

const DEFAULT_SORT = ["start_date", "desc"];

class Course extends TimestampsBase {
  static get tableName() {
    return "courses";
  }

  static getAll() {
    return this.query().orderBy(...DEFAULT_SORT);
  }

  static async getUpcoming() {
    return (
      this.query()
        .orderBy(...DEFAULT_SORT)
        // only return courses that are upcoming (beyond current date)
        .where("start_date", ">", new Date())
        .limit(2)
    );
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
