const Model = require("../connection");

class Course extends Model {
  static get tableName() {
    return "courses";
  }
}

module.exports = Course;
