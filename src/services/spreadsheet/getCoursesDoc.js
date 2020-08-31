const { GoogleSpreadsheet } = require("google-spreadsheet");

// const getASMSecret = require("../secrets/getASMSecret");

/**
 * cached Course Spreadsheet doc to prevent having to re-initialize
 * @type {GoogleSpreadsheet|null}
 */
let cachedDoc = null;

/**
 * returns an initialized Course Spreadsheet object
 * - calls loadInfo() internally to stay synchronized eveyr time it's accessed
 * @param {{ GOOGLE_COURSES_DOC_ID: string, GOOGLE_SHEETS_SERVICE_CREDENTIALS_ASM_ID: string }} env
 */
const getCoursesDoc = async context => {
  const { env, services } = context;
  const {
    GOOGLE_COURSES_DOC_ID,
    GOOGLE_SHEETS_SERVICE_CREDENTIALS_ASM_ID,
  } = env;

  // first initialization
  if (!cachedDoc) {
    cachedDoc = new GoogleSpreadsheet(GOOGLE_COURSES_DOC_ID);

    const credentials = await services.secrets.getSecret(
      GOOGLE_SHEETS_SERVICE_CREDENTIALS_ASM_ID,
    );

    await cachedDoc.useServiceAccountAuth(credentials);
  }

  // always refresh data before returning for usage
  await cachedDoc.loadInfo();

  return cachedDoc;
};

module.exports = getCoursesDoc;
