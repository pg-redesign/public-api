const schemas = require("../../schemas");
const BaseModel = require("./base-model");

class Student extends BaseModel {
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
        relation: BaseModel.HasManyRelation,
        join: {
          from: "students.id",
          to: "payments.student_id",
        },
      },
      courses: {
        modelClass: "course",
        relation: BaseModel.ManyToManyRelation,
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
