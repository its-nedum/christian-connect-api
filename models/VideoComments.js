const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');

const VideoComments = db.define('video_comments', {
    comment: {
        type: sequelize.STRING
    },
    comment_by: {
        type: sequelize.STRING
    },
    video_id: {
        type: sequelize.STRING
    }
})

module.exports = VideoComments