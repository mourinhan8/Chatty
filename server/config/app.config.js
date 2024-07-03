require("dotenv").config();

const config = {};

config.app = {
  port: process.env.PORT || 4000
}

config.database = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  dialect: process.env.DB_TYPE,
  dialectOptions: {
    ssl: {
      require: process.env.NODE_ENV == "production" ? true : false,
    }
  }
};

module.exports = config;
