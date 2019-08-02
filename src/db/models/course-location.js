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
  static create(locationData) {
    return this.query().insert(locationData);
  }

  static getBy(field, columns = []) {
    return this.query()
      .first()
      .where(field)
      .select(columns);
  }

  static getAll(columns = []) {
    return this.query().select(columns);
  }

  // -- PROTO METHODS -- //
  getCourses(columns = []) {
    return this.$relatedQuery("courses").select(columns);
  }
}

module.exports = CourseLocation;
