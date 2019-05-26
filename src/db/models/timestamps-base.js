const { Model } = require("../connection");

/**
 * Base class that sets created_at and updated_at
 * - $beforeInsert(): Date as UTC string
 * - $beforeUpdate(): Date as UTC string
 *
 * call super[.$beforeInsert()][.$beforeUpdate()] if overriding in subclass
 */
class TimestampsBase extends Model {
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = TimestampsBase;
