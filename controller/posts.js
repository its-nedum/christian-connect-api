// Get logged in Users's Id
const getUserId = require('../helpers/getUserId')
// Import Model 
Posts = require('../models/Posts');
Friends = require('../models/Friends');
ImageUpload = require('../helpers/imageUpload');
const sequelize = require('sequelize');

module.exports = { 
    async createPost(req, res) {

        let owner_id = await getUserId(req);
    let post = req.body.post;
    let image_url= null;

    if(!post && !image){
        res.status(400).json({
            message: 'Post or Image required to proceed'
        });
    }
    else{
       
        Posts.create({
            owner_id,
            post,
            image_url,
        }).then((post) => {
            res.status(200).json({
                message: "Post created succesfully", 
                data: post,
            })

        }).catch( (err) => {
            res.status(500).json({
                error: "Something went wrong, please try again later",
                hint: err
                })
            })
        }
    },

    async viewMyPosts(req, res){
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

    },

    async viewFriendsPosts(req, res){
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
    }

  

};
