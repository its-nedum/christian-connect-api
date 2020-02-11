const express = require('express');
const router = express.Router();

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

//GET A LIST OF ALL A USER's CONNECT(Friends)
router.get('/allMyConnect', async(req, res) => {
    const loggedInUserId = await getUserId(req);
    
    
})


module.exports = router