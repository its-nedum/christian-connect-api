const express = require('express');
const router = express.Router();
const controller = require('../controller/posts');



const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}) 




//Send a friend request 
router.post('/createpost', controller.createPost);
router.get('/posts', controller.viewMyPosts);
router.get('/feed', controller.viewFriendsPosts);


module.exports = router
