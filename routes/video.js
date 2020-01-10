const express = require('express');
const router = express.Router();
const getUserName = require('../helpers/getUserName');

//Import Models
const Videos = require('../models/Videos')
const VideoComments = require('../models/VideoComments')
 

//GET ALL VIDEO FROM THE DATABASE
router.get('/category/video',  async (req, res) => {
    Videos.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then( (video) => {
        if(!video){
            return res.status(200).json({
                status: "success",
                data: "No video posted yet"
            })
        }

        res.status(200).json({
            status: "success",
            data: video
        })
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
    
})

//GET A SINGLE VIDEO FROM DATABASE AND ALL ITS COMMENTS
router.get('/category/video/:videoId', async (req, res) => {
    const videoId = req.params.videoId;

    Videos.findOne({
        where: { id: videoId }
    }).then( (video) => {
        if(!video){
            return res.status(200).json({
                status: "success",
                data: "No video posted yet"
            })
        }

        VideoComments.findAll({
            where: { video_id: videoId},
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
                    videoId: video.id,
                    videoTitle: video.video_title,
                    videoAbout: video.video_about,
                    imageUrl: video.image_url,
                    videoUrl: video.video_url,
                    category: video.category,
                    uploadedBy: video.uploaded_by,
                    created_at: video.createdAt,
                    updated_at: video.updatedAt,
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

//POST A COMMENT ON A VIDEO
router.post('/category/video/:videoId/comment', async (req, res) => {
    const videoId = req.params.videoId;
    const comment = req.body.comment;
    const commentBy = await getUserName(req)

    VideoComments.create({
        comment,
        comment_by: commentBy,
        video_id: videoId
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