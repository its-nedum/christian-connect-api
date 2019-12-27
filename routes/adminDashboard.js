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

//DATABASE CONNECTION
const client = require('../database/dbconnect')

router.get('/admin-extra', async(req, res) => {
    const reportHolder = [];
    const musicHolder = []
    const videoHolder = []
    try{
        //For music
        await client.query("SELECT id, music_title, created_at, uploaded_by FROM music ORDER BY id DESC", async (err, result) => {
            if(err) {console.log(err)}
            
            //For video
            await client.query("SELECT id, video_title, created_at, uploaded_by FROM video ORDER BY id DESC", async (err1, result1) => {
                if(err1) {console.log(err1)}
                
                //For lyric
                await client.query("SELECT id, lyric_title, created_at, uploaded_by FROM lyric ORDER BY id DESC", async (err2, result2) => {
                    if(err2) {console.log(err2)}

                    //For event
                    await client.query("SELECT id, theme, created_at, uploaded_by FROM event ORDER BY id DESC", async (err3, result3) => {
                        if(err3) {console.log(err3)}

                        //For job
                        await client.query("SELECT id, position, company, created_at, uploaded_by FROM job ORDER BY id DESC", (err4, result4) => {
                            if(err4) {console.log(err4)}

                            res.status(200).json({
                                status: 'success',
                                data: {
                                    music: result.rows[0],
                                    video: result1.rows[0],
                                    lyric: result2.rows[0],
                                    event: result3.rows[0],
                                    job: result4.rows[0]
                                }
                            })
                        })
                    })
                })
            })
        })
    }catch(err){
        console.log(err)
    }
})


module.exports = router

