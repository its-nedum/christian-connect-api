const express = require('express');
const router = express.Router();

//Import Model
const Jobs = require('../models/Jobs')
 

//GET ALL JOB FROM THE DATABASE
router.get('/category/job',  async (req, res) => {

    Jobs.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then( (item) => {
        
        if(!item){
            return res.status(200).json({
                status: "success",
                data: "No job posted yet"
            })
        }

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


//GET A SINGLE JOB FROM DATABASE
router.get('/job/:jobId', async (req, res) => {
    const jobId = req.params.jobId;
    
    Jobs.findOne({
        where: { id: jobId }
    }).then( (item) => {
        if(!item){
            return res.status(200).json({
                status: "success",
                data: "No job posted yet"
            })
        }

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