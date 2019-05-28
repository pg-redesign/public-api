const { snakeCaseMappers } = require("objection");

const { Model } = require("../connection");
/**
 * Base class for shared configuration
 * - converts snake_case (db side) <--> camelCase (server side)
 * - sets base model path
 *  - allows relations with modelClass to use 'ModelName' string
 * - automatic timestamps
 *  - $beforeInsert(): created_at = new Date as ISO string
 *  - $beforeUpdate(): updated_at = new Date as ISO string
 *  - call super[.$beforeInsert()][.$beforeUpdate()] if overriding in subclass
 */
class TimestampsBase extends Model {
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

module.exports = TimestampsBase;
