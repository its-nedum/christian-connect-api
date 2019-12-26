const express = require('express');
const router = express.Router();
const getUserName = require('../helpers/getUserName');

//DATABASE CONNECTION
const client = require('../database/dbconnect')
 

//GET ALL LYRIC FROM THE DATABASE
router.get('/lyric',  async (req, res) => {
    try{
        client.query("SELECT * FROM lyric ORDER BY id DESC", async (err, result) => {
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

//GET A SINGLE LYRIC FROM DATABASE AND ALL ITS COMMENTS
router.get('/lyric/:lyricId', async (req, res) => {
    const lyricId = req.params.lyricId;
    try{
    await  client.query("SELECT * FROM lyric WHERE id = $1", [lyricId], async (err, result) => {
            if(err) { console.log(err) }

        await client.query("SELECT * FROM lyric_comments WHERE lyric_id = $1 ORDER BY id DESC", [lyricId], async (err, comments) => {
            if(err) { console.log(err) }

            res.status(200).json({
                status: 'success',
                data: {
                    lyricId: result.rows[0].id,
                    lyricTitle: result.rows[0].lyric_title,
                    lyric: result.rows[0].lyric,
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

//POST A COMMENT ON A lyric
router.post('/lyric/:lyricId/comment', async (req, res) => {
    const lyricId = req.params.lyricId;
    const comment = req.body.comment;
    const commentBy = 'Chinedu Emesue' //await getUserName(req)

    try {
        client.query("INSERT INTO lyric_comments(comment, comment_by, lyric_id, created_at)VALUES($1, $2, $3, current_timestamp)",
                    [comment, commentBy, lyricId], async (err) => {
            if(err) { console.log(err)}

            res.status(201).json({
                status: 'success',
                message: 'Comment added successfully',
                data: {
                    comment,
                    commentBy,
                    lyricId,
                    created_at: Date.now()
                }
            })

        })
    }catch(err){
        console.log(err)
    }
})

module.exports = router;