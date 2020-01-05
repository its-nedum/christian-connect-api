const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const Jobs = db.define('jobs', {
    position: {
        type: sequelize.STRING
    },
    company: {
        type: sequelize.STRING
    },
    location: {
        type: sequelize.STRING
    },
    salary: {
        type: sequelize.STRING
    },
    job_type: {
        type: sequelize.STRING
    },
    deadline: {
        type: sequelize.STRING
    },
    summary: {
        type: sequelize.STRING
    },
    description: {
        type: sequelize.STRING
    },
    requirement: {
        type: sequelize.STRING
    },
    apply: {
        type: sequelize.STRING
    },
    category: {
        type: sequelize.STRING
    },
    uploaded_by: {
        type: sequelize.STRING
    }
})

module.exports = Jobs