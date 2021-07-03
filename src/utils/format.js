const { months } = require("./course-constants");

// TODO: what happens when:
// course split (like 7/12-7/16 + 7/19-7/22)
// course extends across months (10/31/21-11/7/21)

// IIFE to leave namespace clear of sub util names
const courseDateRange = (() => {
  /**
   * format: "Month DD-DD, YYYY"
   */
  const formatEnglish = (month, days, year) => {
    const dayRange = days.join("-");
    return `${month} ${dayRange}, ${year}`;
  };

  /**
   * format: "DD a DD de month de YYYY"
   */
  const formatPortuguese = (month, days, year) => {
    const dayRange = days.join(" a ");
    return `${dayRange} de ${month} de ${year}`;
  };

  return (startDate, endDate, language) => {
    const formatter = language === "ENGLISH" ? formatEnglish : formatPortuguese;

    const month = months[startDate.getUTCMonth()][language];
    const days = [startDate, endDate].map(date => date.getUTCDate());
    const year = startDate.getUTCFullYear();

    return formatter(month, days, year);
  };
})();

module.exports = {
  courseDateRange,
};
