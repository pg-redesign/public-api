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
  static async signIn(adminInfo) {
    const { sub } = adminInfo;

    const admin = await this.query()
      .findOne({ sub })
      .throwIfNotFound();

    return admin
      .$query()
      .patchAndFetch({ lastLogin: new Date().toISOString() });
  }
}

module.exports = Admin;
