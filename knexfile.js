const seeds = { directory: "./src/db/seeds" };

const config = {
  client: "postgresql",

  migrations: {
    tableName: "knex_migrations",
    directory: "./src/db/migrations",
    // stub: "./migration.stub", // custom migration template
  },

  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },

  pool: {
    // min: 2,
    // max: 10,
  },
};

module.exports = {
  staging: config,
  production: config,
  test: { ...config, seeds },
  development: { ...config, seeds },
};
