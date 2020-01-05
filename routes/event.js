const express = require('express');
const router = express.Router();

//IMPORT MODEL
const Events = require('../models/Events')
 

//GET ALL EVENT FROM THE DATABASE
router.get('/event',  async (req, res) => {
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


module.exports = router