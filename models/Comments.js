const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');
const Posts = require('./Posts');
const Users = require('./Users')

const Comments = db.define('comments', {
    post_id:{
        type: sequelize.INTEGER, 
        references:{
            model: Posts, 
            key:'id',
        }
    }, 
    owner_id:{
        type: sequelize.INTEGER,
        references:{
            model: Users, 
            key:'id',
        } 
    }, 
    comment:{
        type: sequelize.TEXT, 

    }
})

module.exports = Comments;