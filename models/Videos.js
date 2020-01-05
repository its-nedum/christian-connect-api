const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const Videos = db.define('videos', {
    video_title: {
        type: sequelize.STRING
    },
    video_about: {
        type: sequelize.STRING
    },
    image_url: {
        type: sequelize.STRING
    },
    video_url: {
        type: sequelize.STRING
    },
    category: {
        type: sequelize.STRING
    },
    uploaded_by: {
        type: sequelize.STRING
    }
})

module.exports = Videos