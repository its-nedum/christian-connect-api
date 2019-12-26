const express = require('express');
const router = express.Router();
const getUserName = require('../helpers/getUserName');

//DATABASE CONNECTION
const client = require('../database/dbconnect')
 

//GET ALL VIDEO FROM THE DATABASE
router.get('/video',  async (req, res) => {
    try{
        client.query("SELECT * FROM video ORDER BY id DESC", async (err, result) => {
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

//GET A SINGLE VIDEO FROM DATABASE AND ALL ITS COMMENTS
router.get('/video/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    try{
    await  client.query("SELECT * FROM video WHERE id = $1", [videoId], async (err, result) => {
            if(err) { console.log(err) }

        await client.query("SELECT * FROM video_comments WHERE video_id = $1 ORDER BY id DESC", [videoId], async (err, comments) => {
            if(err) { console.log(err) }

            res.status(200).json({
                status: 'success',
                data: {
                    videoId: result.rows[0].id,
                    videoTitle: result.rows[0].video_title,
                    videoAbout: result.rows[0].video_about,
                    imageUrl: result.rows[0].image_url,
                    videoUrl: result.rows[0].video_url,
                    category: result.rows[0].category,
                    uploadedBy: result.rows[0].uploaded_by,
                    created_at: result.rows[0].created_at,
                    comments: comments.rows
                }
            })
        })
  
        })
    }catch(err){
        console.log(err)
    }
})

//POST A COMMENT ON A SONG
router.post('/video/:videoId/comment', async (req, res) => {
    const videoId = req.params.videoId;
    const comment = req.body.comment;
    const commentBy = 'Chinedu Emesue' //await getUserName(req)

    try {
        client.query("INSERT INTO video_comments(comment, comment_by, video_id, created_at)VALUES($1, $2, $3, current_timestamp)",
                    [comment, commentBy, videoId], async (err) => {
            if(err) { console.log(err)}

            res.status(201).json({
                status: 'success',
                message: 'Comment added successfully',
                data: {
                    comment,
                    commentBy,
                    videoId,
                    created_at: Date.now()
                }
            })

        })
    }catch(err){
        console.log(err)
    }
})

module.exports = router;