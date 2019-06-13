const enums = require("../enums");
const mailingList = require("./mailingList");
const registration = require("./registration");
const stripePayment = require("./stripePayment");

module.exports = {
  // ensures naming conistency across codebase
  [enums.FormTypes.mailingList]: mailingList,
  [enums.FormTypes.registration]: registration,
  [enums.FormTypes.stripePayment]: stripePayment,
};
