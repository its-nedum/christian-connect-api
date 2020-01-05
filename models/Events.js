const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const Events = db.define('events', {
    theme: {
        type: sequelize.STRING
    },
    organizer: {
        type: sequelize.STRING
    },
    ministering: {
        type: sequelize.STRING
    },
    venue: {
        type: sequelize.STRING
    },
    start_date: {
        type: sequelize.STRING
    },
    end_date: {
        type: sequelize.STRING
    },
    time: {
        type: sequelize.STRING
    },
    enquiry: {
        type: sequelize.STRING
    },
    comment: {
        type: sequelize.STRING
    },
    image_url: {
        type: sequelize.STRING
    },
    category: {
        type: sequelize.STRING
    },
    uploaded_by: {
        type: sequelize.STRING
    }

})

module.exports = Events