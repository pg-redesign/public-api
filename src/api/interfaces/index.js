const LocationInterface = require("./location");

const interfaceTypeDefs = `
  ${LocationInterface.typeDefs}
`;

module.exports = {
  interfaceTypeDefs,
  interfaceResolvers: {
    ...LocationInterface.resolvers,
  },
};
