const express = require('express');
const router = express.Router();
const getUserName = require('../helpers/getUserName');

//Import Model
const Musics = require('../models/Musics')
const MusicComments = require('../models/MusicComments')
 

//GET ALL SONG FROM THE DATABASE
router.get('/category/music',  async (req, res) => {
    
    Musics.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then( (music) => {
        if(!music){
            return res.status(200).json({
                status: "success",
                data: "No music posted yet"
            })
        }

        res.status(200).json({
            status: "success",
            data: music
        })
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
    
})

//GET A SINGLE SONG FROM DATABASE AND ALL ITS COMMENTS
router.get('/category/music/:musicId', async (req, res) => {
    const musicId = req.params.musicId;
    
    Musics.findOne({
        where: { id: musicId }
    }).then( (music) => {
        if(!music){
            return res.status(200).json({
                status: "success",
                data: "No music posted yet"
            })
        }

        MusicComments.findAll({
            where: { music_id: musicId},
            order: [
                ['id', 'DESC']
            ]
        }).then( (comments) => {
            if(!comments){
                comments = "No comment posted yet"
            }

            res.status(200).json({
                status: "success",
                data: {
                    musicId: music.id,
                    musicTitle: music.music_title,
                    musicAbout: music.music_about,
                    imageUrl: music.image_url,
                    musicUrl: music.music_url,
                    category: music.category,
                    uploadedBy: music.uploaded_by,
                    created_at: music.createdAt,
                    updated_at: music.updatedAt,
                    comments: comments
                }
            })

        }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
         })
        })
    }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})

//POST A COMMENT ON A SONG
router.post('/category/music/:musicId/comment', async (req, res) => {
    const musicId = req.params.musicId;
    const comment = req.body.comment;
    const commentBy = await getUserName(req)

    MusicComments.create({
        comment,
        comment_by: commentBy,
        music_id: musicId
    }).then( (comment) => {
        res.status(201).json({
            status: "success",
            data: comment
        })
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })

})

module.exports = router;