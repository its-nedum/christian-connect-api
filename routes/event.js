const express = require('express');
const router = express.Router();

//IMPORT MODEL
const Events = require('../models/Events')
 

//GET ALL EVENT FROM THE DATABASE
router.get('/category/event',  async (req, res) => {
    //NOTE: add ORDER BY DESC
    Events.findAll(
        { order:[ 
            ['id', 'DESC'] 
        ]}
    ).then( (item) => {
        res.status(200).json({
            status: "success",
            data: item
        })
    }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
    
})

//Get up coming event for the landing page
router.get('/category/event/up-coming', async (req, res) => {
    Events.findAll(
        {order:[
            ['id', 'DESC']
        ]},
        {limit: 4}
    ).then((item) => {
        res.status(200).json({
            status:'success',
            data: item
        })
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})


module.exports = router