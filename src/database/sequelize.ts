import { Sequelize } from "sequelize";

const globalForSequelize = global as unknown as {
  sequelize?: Sequelize;
};

export const sequelize =
  globalForSequelize.sequelize ??
  new Sequelize(process.env.DATABASE_URL as string, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? false : false,
    dialectOptions:
      process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}
