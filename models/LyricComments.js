const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const LyricComments = db.define('lyric_comments', {
    comment: {
        type: sequelize.STRING
    },
    comment_by: {
        type: sequelize.STRING
    },
    lyric_id: {
        type: sequelize.STRING
    }
})

module.exports = LyricComments