const express = require('express');
const router = express.Router();

//DATABASE CONNECTION
const client = require('../database/dbconnect')
 

//GET ALL JOB FROM THE DATABASE
router.get('/job',  async (req, res) => {
    try{
        client.query("SELECT * FROM job ORDER BY id DESC", async (err, result) => {
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


//GET A SINGLE JOB FROM DATABASE
router.get('/job/:jobId', async (req, res) => {
    const jobId = req.params.jobId;
    try{
    await  client.query("SELECT * FROM job WHERE id = $1", [jobId], async (err, result) => {
            if(err) { console.log(err) }

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