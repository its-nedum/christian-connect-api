const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const MusicComments = db.define('music_comments', {
    comment: {
        type: sequelize.STRING
    },
    comment_by: {
        type: sequelize.STRING
    },
    music_id: {
        type: sequelize.STRING
    }
})

module.exports = MusicComments