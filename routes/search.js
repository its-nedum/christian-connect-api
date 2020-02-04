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
router.get('/search/:searchItems', async (req, res) => {
let term = req.params.searchItems;

    Music.findAll(
        { where: {music_title: { [Op.like]: '%' + term + '%' } } } )
        .then((items) => {
            
            if(!items){
               return res.status(200).json({
                    message: 'Nothing was found'
                })
            }

            res.status(200).json({
                status: 'success',
                data: items
            })
        })
        .catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
}) 

module.exports = router;