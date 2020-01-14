const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload')
const getAdminName = require('../helpers/getAdminName')

//Model CONNECTION
const Musics = require('../models/Musics')
const Videos = require('../models/Videos')
const Lyrics = require('../models/Lyrics')
const Events = require('../models/Events')
const Jobs = require('../models/Jobs')

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
    const uploadedBy = await getAdminName(req);
    const image = req.files.image
    const music = req.files.music

    //Validation check
    if(!musicTitle || !musicAbout || !image || !music){
        return res.status(200).json({
            message: "All fields are required"
        })
    }

    //Check if song already exist
    Musics.findOne({
        where: { music_title: musicTitle }
    }).then( (item) => {
        //If song already exist do this
        if(item){
            return res.status(200).json({
                message: 'Song already exist'
            })
        }else{
            //If song does not exist in database then we add it
            let urls = [];

            //Save the media files in an array
            let media = [image.tempFilePath, music.tempFilePath];
            for(let singleTemp of media){
               cloudinary.uploader.upload(singleTemp, {resource_type: 'auto', folder: 'Christian Connect/music'}, async (err, result) => {
                    if(err){
                        console.log(err)
                    }
                   await urls.push(result.secure_url)
                }) 
            }
            //Save data to Database
            Musics.create({
                music_title: musicTitle,
                music_about: musicAbout,
                image_url: urls[0],
                music_url: urls[1],
                category,
                uploaded_by: uploadedBy
            }).then( (song) => {
                res.status(201).json({
                    status: "success",
                    message: 'Song added successfully',
                    data: song
                })
            }).catch((error) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later"
                })
            })
        }

    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})

//POST A VIDEO TO DATABASE
router.post('/video', async (req, res) => {
    const videoTitle = req.body.videoTitle;
    const videoAbout = req.body.videoAbout;
    const image = req.files.image;
    const video = req.files.video;
    const category = 'Video';
    const uploadedBy = await getAdminName(req);
    //Validation check
    if(!videoTitle || !videoAbout || !image || !video){
        return res.status(200).json({
            message: "All fields are required"
        })
    }
    //Check if video already exist
    Videos.findOne({
        where: { video_title: videoTitle }
    }).then( (item) => {
        //If video already exist do this
        if(item){
            return res.status(200).json({
                message: 'Video already exist'
            })
        }else{
            //If video does not exist in database then we add it
            let urls = [];

            //Save the media files in an array
            let media = [image.tempFilePath, video.tempFilePath];
            for(let singleTemp of media){
            cloudinary.uploader.upload(singleTemp, {resource_type: 'auto', folder: 'Christian Connect/video'}, async (err, result) => {
                    if(err){
                        console.log(err)
                    } console.log(result)
                   await urls.push(result.secure_url)
                }) 
            }
            //Save data to Database
            Videos.create({
                video_title: videoTitle,
                video_about: videoAbout,
                image_url: urls[0],
                video_url: urls[1],
                category,
                uploaded_by: uploadedBy
            }).then( (video) => {
                res.status(201).json({
                    status: "success",
                    message: 'Video added successfully',
                    data: video
                })
            }).catch((error) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later"
                })
            })
        }

    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })

})


//POST LYRIC TO DATABASE
router.post('/lyric', async (req, res) => {
    const  lyricTitle = req.body.lyricTitle;
    const  lyric = req.body.lyric;
    const category = 'Lyric';
    const uploadedBy = await getAdminName(req);
    //Validation check
    if(!lyricTitle || !lyric){
        return res.status(200).json({
            message: "All fields are required"
        })
    }
    //Check if lyric exist
    Lyrics.findOne({
        where: { lyric_title: lyricTitle }
    }).then( (item) => {
        //If lyric exists do this
        if(item){
            return res.status(200).json({
                message: 'Lyrics already exist'
            })
        }else{
            //if lyrics does not exist add it
            Lyrics.create({
                lyric_title: lyricTitle,
                lyric,
                category,
                uploaded_by: uploadedBy
            }).then( (newLyric) => {
                    res.status(201).json({
                        status: "success",
                        message: "Lyric added successfully",
                        data: newLyric
                    })
            }).catch((error) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later"
                })
            })
        }
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})

//POST EVENT TO THE DATABASE
router.post('/event', async (req, res) => {
    const theme = req.body.theme;
    const organizer = req.body.organizer;
    const ministering = req.body.ministering;
    const venue = req.body.venue;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const time = req.body.time;
    const enquiry = req.body.enquiry;
    const comment = req.body.comment;
    const image = req.files.image;
    const category = 'Event';
    const uploadedBy = await getAdminName(req)
    
    //Validation check
    if(!theme || !organizer || !ministering || !venue || !startDate || !endDate
        || !time || !enquiry || !comment || !image){
            return res.status(200).json({
                message: "All fields are required"
            })
        }
    //Check if events already exist
    Events.findOne({
        where: {theme}
    }).then( (item) => {
        if(item){
            return res.status(200).json({
                message: 'Event already exist'
            })
        }else{
            //If event does not exist add it
            //Save event image to cloudinary
                // if(image.mimetype !== 'image/jpg' || image.mimetype !== 'image/png') {
                //     return res.status(200).json({
                //         message: 'Please upload an image file',  
                //         })
                //   }
            cloudinary.uploader.upload(image.tempFilePath, {folder: 'Christian Connect/event'}, async (err, result) => {
                if(err){console.log(err)}
                    let image_url = result.secure_url;
                Events.create({
                    theme,
                    organizer,
                    ministering,
                    venue,
                    start_date: startDate,
                    end_date: endDate,
                    time,
                    enquiry,
                    comment,
                    image_url,
                    category,
                    uploaded_by: uploadedBy
                }).then( (newEvent) => {
                    res.status(201).json({
                        status: "success",
                        message: "Event added successfully",
                        data: newEvent
                    })
                }).catch((error) => {
                    res.status(500).json({
                        error: "Something went wrong, please try again later"
                    })
                })
            })
        }
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})

//POST JOB TO THE DATABASE
router.post('/job', async (req, res) => {
    const position = req.body.position;
    const company = req.body.company;
    const location = req.body.location;
    const salary = req.body.salary;
    const jobType = req.body.jobType;
    const deadline = req.body.deadline;
    const summary = req.body.summary;
    const description = req.body.description;
    const requirement = req.body.requirement;
    const apply = req.body.apply;
    const category = 'Job'
    const uploadedBy = await getAdminName(req)
    //Validation check
    if(!position || !company || !location || !salary || !jobType || !deadline || 
        !summary || !description || !requirement || !apply){
            return res.status(200).json({
                message: "All fields are required"
            })
        }

    Jobs.create({
            position,
            company,
            location,
            salary,
            job_type: jobType,
            deadline,
            summary,
            description,
            requirement,
            apply,
            category,
            uploaded_by: uploadedBy
    }).then( (job) => {
        res.status(201).json({
            status: "success",
            message: "Job added successfully",
            data: job
        })
    }).catch((error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })

})


module.exports = router;