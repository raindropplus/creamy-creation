require("dotenv").config({ path: ".env.local" });

const useSsl =
  process.env.DB_SSL === "true" ||
  /sslmode=(require|verify-full|verify-ca|prefer)/.test(process.env.DATABASE_URL || "");

const dialectOptions = useSsl
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : {};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions,
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
    dialectOptions,
  },
};
