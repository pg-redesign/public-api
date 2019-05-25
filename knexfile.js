const config = {
  client: "postgresql",

  migrations: {
    tableName: "knex_migrations",
    directory: "./src/db/migrations",
  },

  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },

  pool: {},
};

module.exports = {
  staging: config,
  production: config,
  development: config,
};
