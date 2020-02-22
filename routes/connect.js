const express = require('express');
const router = express.Router();
const sequelize = require('sequelize')
const Op = sequelize.Op

const getUserId = require('../helpers/getUserId')
const Users = require('../models/Users')
const Friends = require('../models/Friends')

//GET A LIST OF ALL REGISTERED MEMBERS
router.get('/users', async(req,res) => {

    Users.findAll({
        order:[ 
            ['id', 'DESC'] 
        ]
    }).then((users) => {
        res.status(200).json({
            status: 'success',
            data: users
        })
    }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
});

//VIEW A SINGLE USER PROFILE
router.get('/users/:username', async (req, res) => {
    const username = req.params.username

    Users.findOne({
        where: { username }
    }).then((user) => {
        if(!user){
          return res.status(404).json({
               message: 'User not found',
            })
        }
        res.status(200).json({
            status: 'success',
            data: user
        })
    }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})

//GET A LIST OF ALL MY CONNECTS(Friends)
router.get('/allMyConnect', async(req, res) => {
    const userId = await getUserId(req);
    

    // Filter Posts with friends 
    Friends.findAll({
        where:{
            [Op.or]:[{ requester_id: userId},{requestee_id: userId}],
            status: 'active' 

        }
    }).then((friends) => {
        if(!friends){
            res.status(404).json({
                message: 'You dont have any connect yet'
            })
        }else{
            
            //Get the Id of all the people that your friend 
            let allFriendRequesterId = [];

            friends.map( (item) => {
                allFriendRequesterId.push(item.dataValues.requester_id)
            })

                Users.findAll({
                    where: { 
                        id: {
                            [Op.in]: allFriendRequesterId
                        } 
                    },
                    attributes: ['id', 'firstname', 'lastname', 'username', 'gender', 'state', 'about_me', 'avatar'],
                }).then((user) => {
                    res.status(200).json({
                        status: 'success',
                        message:'Meet all your connect',
                        data: user    
                    })
                    
                }).catch((err) => {
                    res.status(500).json({
                        message: ' Something Went wrong, Please try again', 
                        hint:err,
                    })
                })
            
        
        }
    }).catch((err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
 
})

//GET A SAMPLE LIST OF ALL MY CONNECTS(Friends)
router.get('/allMyConnect-sample', async(req, res) => {
    const userId = await getUserId(req);

    // Filter Posts with friends 
    Friends.findAll({
        where:{
            [Op.or]:[{ requester_id: userId},{requestee_id: userId}],
            status: 'active' 
        },
        order:[
            ['id', 'DESC']
        ]
        },{limit: 4}
    ).then((friends) => {
        if(!friends){
            res.status(404).json({
                message: 'You dont have any connect yet'
            })
        }else{
            //Get the Id of all the people that your friend 
            let allFriendRequesterId = [];

            friends.map( (item) => {
                allFriendRequesterId.push(item.dataValues.requester_id)
            })

            Users.findAll({
                where: { 
                    id: {
                        [Op.in]: allFriendRequesterId
                    } 
                },
                attributes: ['id', 'firstname', 'lastname', 'username', 'gender', 'state', 'about_me', 'avatar'],
            }).then((user) => {
                res.status(200).json({
                    status: 'success',
                    message:'Meet all your connect',
                    data: user    
                })
                
            }).catch((err) => {
                res.status(500).json({
                    message: ' Something Went wrong, Please try again', 
                    hint:err,
                })
            })
        
        }
    }).catch((err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })

})


module.exports = router