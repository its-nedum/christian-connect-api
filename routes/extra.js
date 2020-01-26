const express = require('express');
const router = express.Router()

//Models
const Music = require('../models/Musics')
const Video = require('../models/Videos')
const Lyric = require('../models/Lyrics')
const Event = require('../models/Events')
const Job = require('../models/Jobs')

//SEARCH
router.post('/search', async (req, res) => {

})