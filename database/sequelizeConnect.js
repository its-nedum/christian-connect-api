const sequelize = require('sequelize');

const conString = process.env.ELEPHANT_SQL_DB

const db = new sequelize(conString)

module.exports = db