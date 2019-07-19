const { Model } = require("objection");
const knex = require("knex");

const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  RDS_DB_NAME,
  RDS_HOSTNAME,
  RDS_USERNAME,
  RDS_PASSWORD,
} = process.env;

const connection = knex({
  client: "pg",
  connection: {
    host: DB_HOST || RDS_HOSTNAME,
    user: DB_USER || RDS_USERNAME,
    database: DB_NAME || RDS_DB_NAME,
    password: DB_PASSWORD || RDS_PASSWORD,
  },
});

Model.knex(connection);

module.exports = {
  Model,
  connection,
};
