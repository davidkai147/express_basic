module.exports = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: 'root',
  PORT: 8889,
  DB: 'express_demo',
  dialect: 'mysql',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
