const express = require('express');
const router = express.Router();
const sequelize = require('sequelize')

// Get logged in Users's Id
const getUserId = require('../helpers/getUserId')

// Import Model 
Posts = require('../models/Posts');
Friends = require('../models/Friends');
Users = require('../models/Users')
ImageUpload = require('../helpers/imageUpload');
Comments = require('../models/Comments')

Users.hasMany(Posts, {foreignKey: 'owner_id'})
Posts.belongsTo(Users, {foreignKey: 'owner_id'}) 

Users.hasMany(Comments, {foreignKey: 'owner_id'})
Comments.belongsTo(Users, {foreignKey: 'owner_id'})

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
        if(!friends){
            res.status(404).json({
                message: 'You have not made any connect'
            })
        }else{
        let userFriends = []
       friends.map(friend =>{
           userFriends.push(friend.requestee_id, friend.requester_id)
       })
      
       let allPostId = []
       
      let postPromise = userFriends.map(item => new Promise((resolve,reject) => {
        Posts.findAll({
            where: {owner_id: item}
        }).then((onePost)=>{
            onePost.map((item) => {
                resolve(item.dataValues.id)  
                allPostId.push(item.dataValues.id)
            }) 
        }).catch((err) => {
            res.status(500).json({
                message: ' Something Went wrong, Please try again', 
                hint:err,
            })
        })
      }))

      Promise.all(postPromise).then((result) => {
        let myPromise = allPostId.map(postId => new Promise((resolve,reject) => {
            Posts.findOne({
                where: {id: postId},
                include: [{
                    model: Users,
                }]
            }).then((result) => {
                
                resolve(result)
                
            }).catch((err) => {
                     res.status(500).json({
                         message: ' Something Went wrong, Please try again', 
                         hint:err,
                     })
                 })
        }))
        
        Promise.all(myPromise)
        .then((result) => {
         
            res.status(200).json({
                status: 'success',
                message: 'Friends and posts',
                data: result
            })
            
        }).catch((err) => {
         res.status(502).json({
             message: ' Something Went wrong, Please try again', 
             hint:err,
         })
     })
      })
        

    }
    }).catch((err) => {
        res.status(500).json({
            message: ' Something Went wrong, Please try again', 
            hint:err,
        })
    })
       
});

//POST A COMMENT ON A POST
router.post('/addcommenttopost', async(req,res) => {
    const owner_id = await getUserId(req)
    let {post_id, comment} = req.body

    Comments.create({
        post_id,
        comment,
        owner_id
    }).then((comment) => {
        res.status(201).json({
            status: "success",
            message: "Comment added successfully",
            data: comment
        })
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later",
            hint: err
            })
    })

})


//VIEW A SINGLE POST 
router.get('/viewsinglepost/:postId', async(req, res) => {
    const postId = req.params.postId;
    
    Posts.findOne({
        where: {id: postId},
        include: [{
            model: Users,
        }]
    }).then((post) => {
        res.status(200).json({
            status: "success",
            message: "Post and comments returned",
            data: post
        })
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later",
            hint: err
            })
        })
})

//GET COMMENT FOR A SINGLE POST
router.get('/getcomments/:postId', async(req, res) => {
    const postId = req.params.postId;

    Comments.findAll({
        where: { post_id: postId},
        include: [{
            model: Users
        }]
    }).then((comments) => {
    let result = comments.map(x=> x.get({plain:true}))
        res.status(200).json({
            status: "success",
            message: "All comments for the post",
            data: result
        })
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later",
            hint: err
            })
        })
})


module.exports = router
