const { enums } = require("../../schemas");

module.exports = {
  PaymentTypes: {
    CHECK: enums.PaymentTypes.check,
    CREDIT: enums.PaymentTypes.credit,
  },
  FormTypes: {
    REGISTRATION: enums.FormTypes.registration,
    STRIPE_PAYMENT: enums.FormTypes.stripePayment,
  },
  LanguageTypes: {
    ENGLISH: enums.LanguageTypes.english,
    PORTUGUESE: enums.LanguageTypes.portuguese,
  },
};
