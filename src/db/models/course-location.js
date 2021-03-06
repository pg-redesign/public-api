const schemas = require("../../schemas");
const BaseModel = require("./base-model");

class CourseLocation extends BaseModel {
  static get tableName() {
    return "courseLocations";
  }

  static get jsonSchema() {
    return schemas.types.courseLocation;
  }

  static get relationMappings() {
    return {
      courses: {
        modelClass: "course",
        relation: BaseModel.HasManyRelation,
        join: {
          from: "courseLocations.id",
          to: "courses.courseLocationId",
        },
      },
    };
  }

  // -- STATIC METHODS -- //

  // -- PROTO METHODS -- //
  async getCourses(columns = []) {
    return this.$relatedQuery("courses").select(columns);
  }
}

module.exports = CourseLocation;
