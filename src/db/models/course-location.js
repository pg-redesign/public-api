const schemas = require("../../schemas");
const BaseModel = require("./base-model");

class CourseLocation extends BaseModel {
  static get tableName() {
    return "course_locations";
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
          from: "course_locations.id",
          to: "courses.course_location_id",
        },
      },
    };
  }
}

module.exports = CourseLocation;
