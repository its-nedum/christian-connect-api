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
    try{
        //For music
        await client.query("SELECT id, music_title, created_at, uploaded_by")
    }catch(err){
        console.log(err)
    }
})


module.exports = router

