const sequelize = require('sequelize');

const conString = process.env.LOCAL_DB_URL

const db = new sequelize(conString)

module.exports = db