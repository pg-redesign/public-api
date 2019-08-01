const { snakeCaseMappers } = require("objection");

const { Model } = require("../connection");
/**
 * Base Model class for shared configuration
 * - sets base model path
 *  - allows relations with modelClass to use 'model-file-name' string (no extension)
 *  - ex: Course model in 'course.js' can be set as modelClass: 'course'
 * - converts snake_case (db side) <--> camelCase (API side)
 * - automatic created_at, updated_at timestamps
 *  - $beforeInsert(): created_at = new Date as ISO string
 *  - $beforeUpdate(): updated_at = new Date as ISO string
 *  - call super[.$beforeInsert()][.$beforeUpdate()] if overriding in subclass
 */
class BaseModel extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get modelPaths() {
    return [__dirname];
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = BaseModel;
