const { importSchema } = require("graphql-import");
const { interfaceTypeDefs } = require("../interfaces");

const combinedTypeDefs = `
# loads the SDL type defs
  # import * from '${__dirname}/index.graphql'

# loads the interface type def strings
  ${interfaceTypeDefs}
`;

module.exports = importSchema(combinedTypeDefs);
