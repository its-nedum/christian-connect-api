const express = require('express');
const router = express.Router();
const sequelize = require('sequelize')
const Op = sequelize.Op

// Get logged in Users's Id
const getUserId = require('../helpers/getUserId')

// Import Model 
Posts = require('../models/Posts');
Friends = require('../models/Friends');
Users = require('../models/Users')
ImageUpload = require('../helpers/imageUpload');
Comments = require('../models/Comments')
Likes = require('../models/Likes')

Users.hasMany(Posts, {foreignKey: 'owner_id'})
Posts.belongsTo(Users, {foreignKey: 'owner_id'}) 

Users.hasMany(Comments, {foreignKey: 'owner_id'})
Comments.belongsTo(Users, {foreignKey: 'owner_id'})

Posts.hasMany(Comments, {foreignKey: 'owner_id'})
Comments.belongsTo(Posts, {foreignKey: 'owner_id'})

Posts.hasMany(Likes, {foreignKey: 'post_id'})
Likes.belongsTo(Posts, {foreignKey: 'post_id'})

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
      //Return all the posts created by user whose id is in userFriends array
        Posts.findAll({
            where: {
                owner_id: {
                    [Op.in]: userFriends
                }
            },
            include: [{
                model: Users,
                attributes: ['id', 'firstname', 'lastname', 'avatar']
            },{
                model: Likes,
                attributes: ['id', 'post_id', 'like']
            }] 
        }).then((onePost)=>{
           let result = onePost.map(x=> x.get({plain:true}))
           res.status(200).json({
            status: "success",
            message: "All posts from me and my friends",
            data: result
        })
        }).catch((err) => {
            res.status(500).json({
                message: ' Something Went wrong, Please try again', 
                hint:err,
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
            attributes: ['id', 'firstname', 'lastname', 'avatar']
        },{
            model: Likes,
            attributes: ['id', 'post_id', 'like']
        }]
    }).then((post) => {
        //Then we query to get all the comments length
        Comments.findAndCountAll({
            where: {post_id: postId}
        }).then((num) => {
            let numberOfComments = num.count
            res.status(200).json({
                status: "success",
                message: "Post and comments returned",
                data: {
                    post,
                    numberOfComments
                }
            })
        }).catch( (err) => {
            res.status(500).json({
                error: "Something went wrong, please try again later",
                hint: err
                })
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
            model: Users,
            attributes: ['id', 'firstname', 'lastname', 'avatar']
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


//LIKE A POST
router.post('/like/:postId', async (req, res) => {
    const postId = req.params.postId;
    const userId = await getUserId(req);

    //Check if the user already liked the post if NO then add to like array else remove the user add from the array 
    Likes.findOne({
        where: {
            post_id: postId,
        }
    }).then((likey) => {
        //If no like for that post then create
        if(!likey){
            Likes.create({
              post_id: postId,
            }).then((liked) => {
                //update the like array and add the userId
                Likes.update({
                    like: sequelize.fn('array_append', sequelize.col('like'), userId)
                }, 
                { where: {post_id: postId} }
                ).then((totalLike) => {
                    res.status(201).json({
                        status: 'success',
                        message: 'Post liked',
                        data: {
                            like: liked,
                            totalLike 
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        error: "Something went wrong, please try again later",
                        hint: err
                        })
                    })
                
            }).catch((err) => {
                console.log(err)
                res.status(500).json({
                    error: "Something went wrong, please try again later",
                    hint: err
                    })
                })
        
        }else{
            //If a Like account for that post exist check if the user id is in the array 
            
            //get the like id and the like array
            let likeId = likey.dataValues.id;
            let likes = likey.dataValues.like;

            const checkArray = (item) => {
                return item === userId
            }
            const isAlreadyLiked = likes.find(checkArray)

            if(isAlreadyLiked === userId){
                //If the user already liked this post then unlike it
            //let newLikes = likes.filter( like => like != userId)
            Likes.update(
                {like: sequelize.fn('array_remove', sequelize.col('like'), userId)},
               { where: {   id: likeId  } }
            ).then((unliked) => {
                res.status(201).json({
                    status: 'success',
                    message: 'Post unliked',
                    data: unliked
                })
            }).catch((err) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later",
                    hint: err
                    })
            })
            }else{
                //The user has not liked the post then like it
                //update the like array and add the userId
                Likes.update({
                    like: sequelize.fn('array_append', sequelize.col('like'), userId)
                }, 
                { where: {post_id: postId} }
                ).then((totalLike) => {
                    res.status(201).json({
                        status: 'success',
                        message: 'Post liked',
                        data: {
                            like: totalLike 
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        error: "Something went wrong, please try again later",
                        hint: err
                        })
                    })
                      
            }
            
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).json({
            error: "Something went wrong, please try again later",
            hint: err
            })
    })
})


module.exports = router
