const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');
const Posts = require('./Posts');

const Likes = db.define('likes', {
    post_id:{
        type: sequelize.INTEGER, 
        references:{
            model: Posts, 
            key:'id',
        }
    }, 
    likes:{
        type: sequelize.ARRAY(sequelize.INTEGER), 
        defaultValue: null
    }
})

module.exports = Likes;