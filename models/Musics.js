const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const Musics = db.define('musics', {
    music_title: {
        type: sequelize.STRING
    },
    music_about: {
        type: sequelize.STRING
    },
    image_url: {
        type: sequelize.STRING
    },
    music_url: {
        type: sequelize.STRING
    },
    category: {
        type: sequelize.STRING
    },
    uploaded_by: {
        type: sequelize.STRING
    }
})

module.exports = Musics