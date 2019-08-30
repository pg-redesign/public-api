module.exports = {
  // in href="tel:" compatible format
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
    const domain = process.env.EMAIL_DOMAIN;
    const name = "Princeton Groundwater, Inc.";

    return {
      info: { name, address: `info@${domain}` },
      billing: { name, address: `billing@${domain}` },
      registration: { name, address: `registration@${domain}` },
    };
  })(),
};
