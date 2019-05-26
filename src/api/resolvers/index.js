const typeResolvers = require("./types");
const enumResolvers = require("./enums");
const queryResolvers = require("./queries");
const scalarResolvers = require("./scalars");
const mutationResolvers = require("./mutations");

module.exports = {
  ...typeResolvers,
  ...enumResolvers,
  ...queryResolvers,
  ...scalarResolvers,
  ...mutationResolvers,
};
