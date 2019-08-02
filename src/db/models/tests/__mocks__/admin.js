const { Admin } = require("../../");

const adminSubs = process.env.ADMIN_SUBS.split(",").map(sub => ({ sub }));

const cleanupAdmins = () => Admin.query().del();

const createAdmins = (subs = adminSubs) => Admin.query().insert(subs);

module.exports = {
  adminSubs,
  createAdmins,
  cleanupAdmins,
};
