const express = require('express');
const router = express.Router();
const getUserName = require('../helpers/getUserName');

//Import model
const Lyrics = require('../models/Lyrics');
const LyricComments = require('../models/LyricComments')
 

//GET ALL LYRIC FROM THE DATABASE
router.get('/lyric',  async (req, res) => {
    
    Lyrics.findAll({
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

//GET A SINGLE LYRIC FROM DATABASE AND ALL ITS COMMENTS
router.get('/lyric/:lyricId', async (req, res) => {
    const lyricId = req.params.lyricId;
    
    Lyrics.findOne({
        where: { id: lyricId }
    }).then( (lyric) => {
        if(!lyric){
            return res.status(200).json({
                status: "success",
                data: "No lyric posted yet"
            })
        }

        LyricComments.findAll({
            where: { lyric_id: lyricId},
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
                    lyricId: lyric.id,
                    lyricTitle: lyric.lyric_title,
                    lyric: lyric.lyric,
                    category: lyric.category,
                    uploadedBy: lyric.uploaded_by,
                    created_at: lyric.createdAt,
                    updated_at: lyric.updatedAt,
                    comments: comments
                }
            })

        }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later1"
         })
        })
    }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later2"
        })
    })
})

//POST A COMMENT ON A lyric
router.post('/lyric/:lyricId/comment', async (req, res) => {
    const lyricId = req.params.lyricId;
    const comment = req.body.comment;
    const commentBy = await getUserName(req)

    LyricComments.create({
        comment,
        comment_by: commentBy,
        lyric_id: lyricId
    }).then( (comment) => {
        res.status(201).json({
            status: "success",
            data: comment
        })
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later2"
        })
    })
})

module.exports = router;