const express = require('express');
const router = express.Router();

//DATABASE CONNECTION
const client = require('../database/dbconnect')
 

//GET ALL EVENT FROM THE DATABASE
router.get('/event',  async (req, res) => {
    try{
        client.query("SELECT * FROM event ORDER BY id DESC", async (err, result) => {
            if(err){ console.log(err) }

            res.status(200).json({
                status: 'success',
                data: result.rows
            })
        })
    }catch(err){
        console.log(err)
    }
    
})


module.exports = router