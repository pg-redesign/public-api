const enums = require("../enums");
const registration = require("./registration");
const stripePayment = require("./stripePayment");

const forms = {};

// ensures naming conistency across codebase
forms[enums.FormTypes.registration] = registration;
forms[enums.FormTypes.stripePayment] = stripePayment;

module.exports = forms;
