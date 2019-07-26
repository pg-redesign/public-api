const { Admin } = require("../models");

const adminSubs = process.env.ADMIN_SUBS.split(",").map(sub => ({ sub }));

exports.seed = async () => {
  const [countResult] = await Admin.query().count();

  if (countResult.count === adminSubs.length) {
    return;
  }

  await Admin.query().delete();
  await Admin.query().insert(adminSubs);
};
