require("dotenv").config();

const config = {
  database: {
    production: [
      process.env.DB_NAME,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          }
        },
      }
    ],
    dev: [
      process.env.DB_NAME,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE,
      }
    ]
  }
};

config.app = {
  port: process.env.PORT || 4000
};

module.exports = config;
