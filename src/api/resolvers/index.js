const typeResolvers = require("./types");
const queryResolvers = require("./queries");
const scalarResolvers = require("./scalars");
const mutationResolvers = require("./mutations");
const { interfaceResolvers } = require("../interfaces");

module.exports = {
  ...typeResolvers,
  ...queryResolvers,
  ...scalarResolvers,
  ...mutationResolvers,
  ...interfaceResolvers,
};
