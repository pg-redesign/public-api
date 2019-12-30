const emailDomain = process.env.EMAIL_HOST;

module.exports = {
  // in href="tel:" compatible format
  phoneContact: "+1-813-964-0800",
  siteLinks: (() => {
    const home = `https://${emailDomain}`;
    const creditPayment = `${home}/payment/credit`;

    return {
      home,
      creditPayment,
    };
  })(),
  accounts: (() => {
    const name = "Princeton Groundwater, Inc.";

    return {
      info: { name, address: `info@${emailDomain}` },
      billing: { name, address: `billing@${emailDomain}` },
      registration: { name, address: `registration@${emailDomain}` },
    };
  })(),
};
