const { snakeCaseMappers } = require("objection");

const { Model } = require("../connection");
/**
 * Base class that sets created_at and updated_at
 * - $beforeInsert(): Date as UTC string
 * - $beforeUpdate(): Date as UTC string
 *
 * call super[.$beforeInsert()][.$beforeUpdate()] if overriding in subclass
 */
class TimestampsBase extends Model {
  static get columnNameMappers() {
    // converts snake_case columns to camelCase in instances
    return snakeCaseMappers();
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = TimestampsBase;
