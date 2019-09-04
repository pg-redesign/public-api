const { Admin } = require("../models");
const {
  adminSubs,
  createAdmins,
  cleanupAdmins,
} = require("../models/tests/__mocks__/admin");

exports.seed = async () => {
  const [countResult] = await Admin.query()
    .count()
    .whereIn("sub", adminSubs);

  // reset the admins if there is a mismatch
  return (
    countResult.count !== adminSubs.length &&
    cleanupAdmins().then(() => createAdmins())
  );
};
