const express = require('express');
const router = express.Router();
const sequelize = require('sequelize')

// Get logged in Users's Id
const getUserId = require('../helpers/getUserId')

// Import Model 
Posts = require('../models/Posts');
Friends = require('../models/Friends');
ImageUpload = require('../helpers/imageUpload');

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}) 


//CREATE A POST
router.post('/createpost', async (req, res) => {
    
    let owner_id = await getUserId(req);
    let post = req.body.post;
    
    if(!post){
        return res.status(400).json({
             message: 'Post required to proceed'
         });
     }
    
    //Save post without Image
    if(!req.files){
        Posts.create({
            owner_id,
            post,
            image_url: null
        }).then((post) => {
            res.status(201).json({
                status: "success",
                message: "Post created succesfully", 
                data: post,
            })
        }).catch( (err) => {
            res.status(500).json({
                error: "Something went wrong, please try again later",
                hint: err
                })
            })
    }else{
        //Save post with image
        let image = req.files.image;
        cloudinary.uploader.upload(image.tempFilePath, {folder: 'Christian Connect/images'}, async (err, result) => {
            if(err){console.log(err)}
            let image_url = result.secure_url;
    
            Posts.create({
                owner_id,
                post,
                image_url,
            }).then((post) => {
                res.status(201).json({
                    status: "success",
                    message: "Post created succesfully", 
                    data: post,
                })
            }).catch( (err) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later",
                    hint: err
                    })
                })
    
        })
    }
    
    });


//VIEW MY POST
router.get('/posts', async (req, res) => {
    let userId = await getUserId(req);

    // View all Pending request sent by logged in user
    Posts.findAll({
        where:{
            owner_id: userId, 
        }

    }).then((posts) => {
        if(!posts){
            res.status(404).json({
                message:'No posts were found for logged in user'
            })
        }else{
            res.status(200).json({
                message:"User's Posts",
                data: posts, 

            })
        }
    }).catch((err)=>{
        res.status(500).json({
            message: ' Something Went wrong, Please try again', 
            hint:err,
        })
    })

});


//VIEW FRIENDS POST INCLUDING YOURS
router.get('/feed', async (req, res) => {
    let userId = await getUserId(req);
    const Op = sequelize.Op

    // Filter Posts with friends 
    Friends.findAll({
        where:{
            [Op.or]:[{ requester_id: userId},{requestee_id: userId}],
            status: 'active' 

        }
    }).then((friends)=>{
        let userFriends = []
       friends.map(friend =>{
           userFriends.push(friend.requestee_id, friend.requester_id)
       })
       Posts.findAll({
           where:{
               owner_id: userFriends
           }
       }).then((posts) =>{
        res.status(200).json({
            message: "Post created succesfully", 
            data: posts,
            friends: userFriends,
        })
       })
    })
});


module.exports = router
