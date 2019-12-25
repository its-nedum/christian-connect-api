const express = require('express');
const router = express.Router();

//DATABASE CONNECTION
const client = require('../database/dbconnect')
 

//GET ALL SONG FROM THE DATABASE
router.get('/music',  async (req, res) => {
    try{
        client.query("SELECT * FROM music ORDER BY id DESC", async (err, result) => {
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

//GET A SINGLE SONG FROM DATABASE AND ALL ITS COMMENTS
router.get('/music/:musicId', async (req, res) => {
    const musicId = req.params.musicId;
    try{
    await  client.query("SELECT * FROM music WHERE id = $1", [musicId], async (err, result) => {
            if(err) { console.log(err) }

        await client.query("SELECT * FROM music_comments WHERE music_id = $1 ORDER BY id DESC", [musicId], async (err, comments) => {
            if(err) { console.log(err) }

            res.status(200).json({
                status: 'success',
                data: {
                    musicId: result.rows[0].id,
                    musicTitle: result.rows[0].music_title,
                    musicAbout: result.rows[0].music_about,
                    imageUrl: result.rows[0].image_url,
                    musicUrl: result.rows[0].music_url,
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
router.post('/music/:musicId/comment', async (req, res) => {
    const musicId = req.params.musicId;
    const comment = req.body.comment;
    const commentBy = 'Chinedu Emesue' //getUserName()

    try {
        client.query("INSERT INTO music_comments(comment, comment_by, music_id, created_at)VALUES($1, $2, $3, current_timestamp)",
                    [comment, commentBy, musicId], async (err) => {
            if(err) { console.log(err)}

            res.status(201).json({
                status: 'success',
                message: 'Comment added successfully',
                data: {
                    comment,
                    commentBy,
                    musicId,
                    created_at: Date.now()
                }
            })

        })
    }catch(err){
        console.log(err)
    }
})

module.exports = router;