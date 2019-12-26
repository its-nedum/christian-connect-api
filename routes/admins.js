const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload')
const getAdminName = require('../helpers/getAdminName')


//DATABASE CONNECTION
const client = require('../database/dbconnect')

//SETUP CLOUDINARY
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//SETUP FILEUPLOAD
router.use(fileUpload({
    useTempFiles: true
}))
  
//POST A SONG TO THE DATABASE
router.post('/music',  async (req, res) => {
    //Collect form data
    const musicTitle = req.body.musicTitle;
    const musicAbout = req.body.musicAbout;
    const category = 'Music';
    const uploadedBy = 'Chinedu Emesue' //await getAdminName(req);
    const image = req.files.image
    const music = req.files.music

    //Check if song already exist
    await client.query("SELECT * FROM music WHERE music_title = $1", [musicTitle], async (err, result) => {
        if(err) { console.log(err) }
        //If song already exist do this
        if(result.rows[0]){
            return res.status(400).json({
                message: 'Song already exist'
            })
        } else {
            //If song does not exist in database then we add it
            let urls = [];

            //Save the media files in an array
            let media = [image.tempFilePath, music.tempFilePath];
            for(let singleTemp of media){
              await  cloudinary.uploader.upload(singleTemp, async (err, result) => {
                    if(err){
                        console.log(err)
                    }
                   await urls.push(result.url)
                })
              
            }
            //Save data to Database
            await client.query("INSERT INTO music(music_title, music_about, image_url, music_url, category, uploaded_by, created_at)VALUES($1, $2, $3, $4, $5, $6, current_timestamp)",
                            [musicTitle, musicAbout, urls[0], urls[1], category, uploadedBy], (err) => {
                             if(err){console.log(err)}  
                            
                             res.status(201).json({
                                status: 'success',
                                message: 'Song added successfully',
                                data: {
                                    musicTitle,
                                    musicAbout,
                                    imageUrl: urls[0],
                                    musicUrl: urls[1],
                                    category,
                                    uploadedBy,
                                    created_at: Date.now()
                                }
                            })
        
                            })
        }
    })

})

//POST A VIDEO TO DATABASE
router.post('/video', async (req, res) => {
    const videoTitle = req.body.videoTitle;
    const videoAbout = req.body.videoAbout;
    const image = req.files.image;
    const video = req.files.video;
    const category = 'Video';
    const uploadedBy = 'Chinedu Emesue' //await getAdminName(req);

    //Check if song already exist
    await client.query("SELECT * FROM video WHERE video_title = $1", [videoTitle], async (err, result) => {
        if(err) { console.log(err) }
        //If song already exist do this
        if(result.rows[0]){
            return res.status(400).json({
                message: 'Video already exist'
            })
        } else {
            //If song does not exist in database then we add it
            let urls = [];

            //Save the media files in an array
            let media = [image.tempFilePath, video.tempFilePath];
            for(let singleTemp of media){
              await  cloudinary.uploader.upload(singleTemp, async (err, result) => {
                    if(err){
                        console.log(err)
                    }
                   await urls.push(result.url)
                })
              
            }
            //Save data to Database
            await client.query("INSERT INTO video(video_title, video_about, image_url, video_url, category, uploaded_by, created_at)VALUES($1, $2, $3, $4, $5, $6, current_timestamp)",
                            [videoTitle, videoAbout, urls[0], urls[1], category, uploadedBy], (err) => {
                             if(err){console.log(err)}  
                            
                             res.status(201).json({
                                status: 'success',
                                message: 'Video added successfully',
                                data: {
                                    videoTitle,
                                    videoAbout,
                                    imageUrl: urls[0],
                                    videoUrl: urls[1],
                                    category,
                                    uploadedBy,
                                    created_at: Date.now()
                                }
                            })
        
                            })
        }
    })

})






module.exports = router;