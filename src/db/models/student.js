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
          to: "payments.studentId",
        },
      },
      courses: {
        modelClass: "course",
        relation: BaseModel.ManyToManyRelation,
        join: {
          from: "students.id",
          to: "courses.id",
          through: {
            from: "payments.studentId",
            to: "payments.courseId",
          },
        },
      },
    };
  }

  // -- STATIC METHODS -- //
  static async subscribeToMailingList(mailingListData) {
    const updatedCount = await this.query()
      .patch({ mailingList: true })
      .where({ email: mailingListData.email });

    if (!updatedCount) {
      await this.query().insert({ ...mailingListData, mailingList: true });
    }

    return true;
  }

  // -- PROTO METHODS -- //
  async getCoursePayment(courseId, columns = []) {
    return this.$relatedQuery("payments")
      .first()
      .columns(columns)
      .where({ courseId });
  }
}

module.exports = Student;
