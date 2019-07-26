const schemas = require("../../schemas");
const BaseModel = require("./base-model");

class Admin extends BaseModel {
  static get tableName() {
    return "admins";
  }

  static get jsonSchema() {
    return schemas.types.admin;
  }

  // -- STATIC METHODS -- //
  static signIn(adminInfo) {
    const { sub } = adminInfo;

    return this.query()
      .findOne({ sub })
      .throwIfNotFound();
  }
}

module.exports = Admin;
