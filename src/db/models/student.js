const { Model } = require("../connection");
const schemas = require("../../schemas");
const TimestampsBase = require("./timestamps-base");

class Student extends TimestampsBase {
  static get tableName() {
    return "students";
  }

  static get jsonSchema() {
    return schemas.types.student;
  }

  static get relationMappings() {
    return {
      payments: {
        modelClass: "payment",
        relation: Model.HasManyRelation,
        join: {
          from: "students.id",
          to: "payments.student_id",
        },
      },
      courses: {
        modelClass: "course",
        relation: Model.ManyToManyRelation,
        join: {
          from: "students.id",
          to: "courses.id",
          through: {
            from: "payments.student_id",
            to: "payments.course_id",
          },
        },
      },
    };
  }
}

module.exports = Student;
