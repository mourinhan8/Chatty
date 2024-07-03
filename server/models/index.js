const Sequelize = require("sequelize");
const config = require("../config/app.config")

const databaseConfig = process.env.NODE_ENV == "production" ? config.database.production : config.database.dev
const sequelize = new Sequelize(...databaseConfig);

const db = {
  models: {}
};

const modelDefiners = [
	require("./userModel"),
  require("./conversationModel"),
  require("./userConversationModel"),
	require("./messageModel"),
	// Add more models here...
	// require('./models/item'),
];

for (const modelDefiner of modelDefiners) {
	const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db.models[model.name] = model;
}

Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;