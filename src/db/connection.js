const { Model } = require("objection");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
});

Model.knex(knex);

module.exports = {
  knex,
  Model,
};
