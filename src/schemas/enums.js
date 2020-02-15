const PaymentOptions = {
  credit: "CREDIT",
  invoice: "INVOICE",
};

const PaymentTypes = {
  check: "CHECK",
  credit: "CREDIT",
  transfer: "TRANSFER",
};

const FormTypes = {
  mailingList: "MAILING_LIST",
  registration: "REGISTRATION",
  stripePayment: "STRIPE_PAYMENT",
};

const LanguageTypes = {
  english: "ENGLISH",
  portuguese: "PORTUGUESE",
};

const CourseShortNames = {
  pollution: "POLLUTION",
  remediation: "REMEDIATION",
};

const GoogleSheetTabColors = {
  [CourseShortNames.pollution]: {
    red: 0,
    green: 0,
    blue: 200,
    alpha: 1.0,
  },
  [CourseShortNames.remediation]: {
    red: 0,
    blue: 0,
    green: 200,
    alpha: 1.0,
  },
};

module.exports = {
  FormTypes,
  PaymentTypes,
  LanguageTypes,
  PaymentOptions,
  CourseShortNames,
  GoogleSheetTabColors,
};
