const knex = require("knex");
const { Model, knexSnakeCaseMappers } = require("objection");

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const connection = knex({
  client: "pg",
  connection: {
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD,
  },
  ...knexSnakeCaseMappers(),
});

Model.knex(connection);

module.exports = {
  Model,
  connection,
};
