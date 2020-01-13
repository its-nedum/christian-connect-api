const sequelize = require('sequelize');
const db = require('../database/sequelizeConnect');
const Users = require('./Users');

const Friends = db.define('friends', {
    requester_id:{
        type: sequelize.INTEGER, 
        references:{
            model: Users, 
            key:'id',
        }
    }, 
    requestee_id:{
        type: sequelize.INTEGER, 
        references:{
            model:Users, 
            key:'id,'
        }
    }, 
    status:{
        type: sequelize.TEXT, 

    }
})

module.exports = Friends;