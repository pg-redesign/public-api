const courseShortNames = {
  pollution: "POLLUTION",
  remediation: "REMEDIATION",
};

const courseNames = {
  [courseShortNames.pollution]: "Pollution & Hydrology Course",
  [courseShortNames.remediation]: "Remediation Course",
};

const courseDescriptions = {
  POLLUTION: [
    "Basic to Advanced Principles in Groundwater Pollution and Hydrology",
    "Basic to Advanced Concepts and Principles of Groundwater Flow, Fate and Transport and Natural Attenuation",
    "Groundwater Monitoring And Sampling Technology",
    "Conceptual Site Models (CSM) & Remediation Strategies",
    "Practical Applications of Modern Modeling Software",
  ],
  REMEDIATION: [
    // TODO: complete description
  ],
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
  courseNames,
  courseShortNames,
  courseDescriptions,
};
