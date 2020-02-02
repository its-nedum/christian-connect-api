const express = require('express');
const router = express.Router()
const {Op}  = require('sequelize')

//Models
const Music = require('../models/Musics')
const Video = require('../models/Videos')
const Lyric = require('../models/Lyrics')
const Event = require('../models/Events')
const Job = require('../models/Jobs')

//SEARCH
router.post('/search', async (req, res) => {
let term = req.body.term;

    Music.findAll(
        { where: {music_title: { [Op.like]: '%' + term + '%' } } } )
        .then((items) => {
            res.status(200).json({
                status: 'success',
                data: {
                    results: items
                }
            })
        })
        .catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
}) 

module.exports = router;