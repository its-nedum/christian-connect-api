const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const Admins = db.define('admins', {
    firstname: {
        type: sequelize.STRING
    },
    lastname: {
        type: sequelize.STRING
    },
    email: {
        type: sequelize.STRING
    },
    username: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    },
    admin_type: {
        type: sequelize.STRING
    }
})

module.exports = Admins