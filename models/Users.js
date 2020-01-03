const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const Users = db.define('users', {
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
    telephone: {
        type: sequelize.STRING
    },
    country: {
        type: sequelize.STRING
    },
    state: {
        type: sequelize.STRING
    },
    city: {
        type: sequelize.STRING
    },
    gender: {
        type: sequelize.STRING
    },
    birthdate: {
        type: sequelize.STRING
    },
    relationship_status: {
        type: sequelize.STRING
    },
    work: {
        type: sequelize.STRING
    },
    school: {
        type: sequelize.STRING
    },
    about_me: {
        type: sequelize.STRING
    },
    avatar: {
        type: sequelize.STRING
    }
})

module.exports = Users