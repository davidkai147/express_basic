const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAlias: false,
  socketPath: dbConfig.socketPath,
  port: dbConfig.PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models
db.tasks = require('./task.model')(sequelize, Sequelize);
db.users = require('./user.model')(sequelize, Sequelize);

// Relationship
db.users.hasMany(db.tasks, { as: 'tasks' });
db.tasks.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = db;
