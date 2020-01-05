const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const Lyrics = db.define('lyrics', {
    lyric_title: {
        type: sequelize.STRING
    },
    lyric: {
        type: sequelize.STRING
    },
    category: {
        type: sequelize.STRING
    },
    uploaded_by: {
        type: sequelize.STRING
    }
})

module.exports = Lyrics