const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');
const Users = require('./Users');

const Posts = db.define('posts', {
    owner_id:{
        type: sequelize.INTEGER, 
        references:{
            model: Users, 
            key:'id',
        }
    }, 
    post:{
        type: sequelize.TEXT, 
    }, 
    image_url:{
        type: sequelize.TEXT, 

    }
})

module.exports = Posts;