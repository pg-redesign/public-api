const enums = require("../enums");
const registration = require("./registration");
const stripePayment = require("./stripePayment");

module.exports = {
  // ensures naming conistency across codebase
  [enums.FormTypes.registration]: registration,
  [enums.FormTypes.stripePayment]: stripePayment,
};
