module.exports = {
  /* eslint max-len:0 */
  /**
   * node -e 'console.log(JSON.stringify(Array(12).fill().reduce((months, _, num) => ({...months,[num]:{english:"", portuguese:""}}), {})))' | python -m json.tool
   */
  months: {
    0: {
      english: "January",
      portuguese: "janeiro",
    },
    1: {
      english: "February",
      portuguese: "fevereiro",
    },
    2: {
      english: "March",
      portuguese: "março",
    },
    3: {
      english: "April",
      portuguese: "abril",
    },
    4: {
      english: "May",
      portuguese: "maio",
    },
    5: {
      english: "June",
      portuguese: "junho",
    },
    6: {
      english: "July",
      portuguese: "julho",
    },
    7: {
      english: "August",
      portuguese: "agosto",
    },
    8: {
      english: "September",
      portuguese: "setembro",
    },
    9: {
      english: "October",
      portuguese: "outubro",
    },
    10: {
      english: "November",
      portuguese: "novembro",
    },
    11: {
      english: "December",
      portuguese: "dezembro",
    },
  },
};
