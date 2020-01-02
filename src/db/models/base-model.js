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
  static get modelPaths() {
    return [__dirname];
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  // -- STATIC METHODS -- //
  static async create(data) {
    return this.query().insert(data);
  }

  static async getBy(field, columns = []) {
    return this.query()
      .first()
      .where(field)
      .select(columns);
  }

  /**
   * LESSON LEARNED: duplicated queries!
   *
   * objection queries are NOT Promises
   * - they are "thenable" but not a Promise implementation
   * - if you have a chain: resolver -> Model/instance method -> QueryBuilder
   * - what is returned is a Query thenable query stub
   * - AS (2.0+) will end up executing the method twice because of recursive promise resolution behavior
   *
   * - AS chains a .then() on the end (thinking it is a promise):
   *  queryBuilder + .then() -> executes the query and returns a promise
   *  + .then() (on the returned promise) -> resolves second time
   *
   * AS thread:https://github.com/apollographql/apollo-server/issues/2501
   *
   * solutions:
   * - make the resolver or method async (to wrap it in a promise)
   * - terminate the query using .execute() in the method
   */
  static async getAll(columns = []) {
    return this.query().select(columns);
  }
}

module.exports = BaseModel;
