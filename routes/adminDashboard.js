/*
This route handles the report information the Admin sees when
he/she logs in to their dashboard such as
1. Music report
2. Video report
3. Lyric report
4. Event report
5. Job report
Information needed are 
A. Total number of items
B. Name of last item added
C. Date of last item added
D. Name of the Admin that added last item
E. Name of company for last item(Jobs only)
*/

const express = require('express');
const router = express.Router();

//Model CONNECTION
const Musics = require('../models/Musics')
const Videos = require('../models/Videos')
const Lyrics = require('../models/Lyrics')
const Events = require('../models/Events')
const Jobs = require('../models/Jobs')

router.get('/admin-extra', async(req, res) => {
    //Get music report
    Musics.findOne({
        attributes: ['id', 'music_title', 'createdAt', 'uploaded_by'],
        order: [
            ['id', 'DESC']
        ]
    }).then( (music) => {
        Videos.findOne({
            attributes: ['id', 'video_title', 'createdAt', 'uploaded_by'],
            order: [
                ['id', 'DESC']
            ] 
        }).then( (video) => {
            Lyrics.findOne({
                attributes: ['id', 'lyric_title', 'createdAt', 'uploaded_by'],
                order: [
                    ['id', 'DESC']
                ]
            }).then( (lyric) => {
                Events.findOne({
                    attributes: ['id', 'theme', 'createdAt', 'uploaded_by'],
                    order: [
                        ['id', 'DESC']
                    ]
                }).then( (event) => {
                    Jobs.findOne({
                        attributes: ['id', 'position', 'company', 'createdAt', 'uploaded_by'],
                        order: [
                            ['id', 'DESC']
                        ]
                    }).then( (job) => {
                            res.status(200).json({
                                status: "success",
                                data: {
                                    music,
                                    video,
                                    lyric,
                                    event,
                                    job
                                }
                            })
                    }).catch((error) => {
                        res.status(500).json({
                            error: "Something went wrong, please try again later"
                        })
                    })
                }).catch((error) => {
                    res.status(500).json({
                        error: "Something went wrong, please try again later"
                    })
                })
            }).catch((error) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later"
                })
            })
        }).catch((error) => {
            res.status(500).json({
                error: "Something went wrong, please try again later"
            })
        })
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
    
})


module.exports = router

