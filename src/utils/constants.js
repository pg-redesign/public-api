// internal (DB, API) single word names
const courseInternalNames = {
  pollution: "POLLUTION",
  remediation: "REMEDIATION",
};

// full course name
const fullCourseNames = {
  [courseInternalNames.pollution]: "Pollution & Hydrology Course",
  [courseInternalNames.remediation]: "Remediation Course",
};

// TODO: move to editable view data
const courseDescriptions = {
  [courseInternalNames.pollution]: [
    "Basic to Advanced Principles in Groundwater Pollution and Hydrology",
    "Basic to Advanced Concepts and Principles of Groundwater Flow, Fate and Transport and Natural Attenuation",
    "Groundwater Monitoring And Sampling Technology",
    "Conceptual Site Models (CSM) & Remediation Strategies",
    "Practical Applications of Modern Modeling Software",
  ],
  [courseInternalNames.remediation]: [
    // TODO: complete description
  ],
};

const stripeService = {
  // NOTE: adjust message based on fullCourseNames
  paymentDescription: course => `Princeton Groundwater ${fullCourseNames[course.name]} payment`,
};

const emailService = {
  phoneContact: "+01-813-964-0800",
  siteLinks: (() => {
    const home = "https://princeton-groundwater.com";
    const creditPayment = `${home}/payment/credit`;

    return {
      home,
      creditPayment,
    };
  })(),
  accounts: (() => {
    const name = "Princeton Groundwater, Inc.";
    const domain = "princeton-groundwater.com";

    return {
      info: { name, address: `info@${domain}` },
      billing: { name, address: `billing@${domain}` },
      registration: { name, address: `registration@${domain}` },
    };
  })(),
};

/* eslint max-len:0 */
/**
 * node -e 'console.log(JSON.stringify(Array(12).fill().reduce((months, _, num) => ({...months,[num]:{ENGLISH:"", PORTUGUESE:""}}), {})))' | python -m json.tool
 */
const months = {
  0: {
    ENGLISH: "January",
    PORTUGUESE: "janeiro",
  },
  1: {
    ENGLISH: "February",
    PORTUGUESE: "fevereiro",
  },
  2: {
    ENGLISH: "March",
    PORTUGUESE: "março",
  },
  3: {
    ENGLISH: "April",
    PORTUGUESE: "abril",
  },
  4: {
    ENGLISH: "May",
    PORTUGUESE: "maio",
  },
  5: {
    ENGLISH: "June",
    PORTUGUESE: "junho",
  },
  6: {
    ENGLISH: "July",
    PORTUGUESE: "julho",
  },
  7: {
    ENGLISH: "August",
    PORTUGUESE: "agosto",
  },
  8: {
    ENGLISH: "September",
    PORTUGUESE: "setembro",
  },
  9: {
    ENGLISH: "October",
    PORTUGUESE: "outubro",
  },
  10: {
    ENGLISH: "November",
    PORTUGUESE: "novembro",
  },
  11: {
    ENGLISH: "December",
    PORTUGUESE: "dezembro",
  },
};

module.exports = {
  months,
  emailService,
  stripeService,
  fullCourseNames,
  courseDescriptions,
  courseInternalNames,
};
