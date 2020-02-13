const express = require('express');
const router = express.Router();

// Get logged in Users's Id
const getUserId = require('../helpers/getUserId')

// Import Model 
Requests = require('../models/Requests'); 
Friends = require('../models/Friends');
Users = require('../models/Users')


//Send a friend request 
router.post('/sendfriendrequest/:requesteeid', async (req, res) => {

    let requester_id = await getUserId(req);
    let requestee_id = req.params.requesteeid;
    console.log(requester_id)
    console.log(requestee_id)
    if( requestee_id == requester_id){
        res.status(400).json({
            message: "You Cannot send a Friend Request to yourself!", 
        })

    }else {
        Requests.findOne({
            where: {
                requester_id: requester_id, 
                requestee_id: requestee_id,
                status:'pending'
    
            }
        }).then((requests) => {
    
            // if request does not exist create it 
            if(requests){
                res.status(200).json({
                    message: "Friend request already sent awaiting confirmation", 
                    data: requests,
                })
    
            }
            else{
                Requests.create({
                    requester_id, 
                    requestee_id,
                    status: 'pending'
    
                }).then((request) => {
                    res.status(201).json({
                        message: " Friend Request send succesfully", 
                        data: request,
                    })
                }).catch( (err) => console.log(err))  
    
            }
    
        }).catch( (err) => {
            res.status(500).json({
                error: "Something went wrong, please try again later",
                hint: err
            })
        })

    }

});


//VIEW FRIEND REQUEST
router.get('/viewrequestsent', async (req, res) => {
    let userId = await getUserId(req);

    // View all Pending request sent by logged in user 

    Requests.findAll({
        where:{
            requester_id: userId, 
            status: 'pending',
        }

    }).then((requests) => {
        if(!requests){
            res.status(404).json({
                message:'You Have not sent any friend requests'
            })
        }else{
            //Get the Id of all the people that you sent a friend request
            let allRequesteeId = [];
            //Get the request Id from the request table
            let requestIds = [];
            
            requests.map( (item) => {
                allRequesteeId.push(item.dataValues.requestee_id)
                requestIds.push(item.dataValues.id)
            })

            let reqPromise = allRequesteeId.map(requestee_id => new Promise((resolve, reject) => {
                Users.findOne({
                    where: { id: requestee_id },
                    attributes: ['id', 'firstname', 'lastname', 'gender', 'state', 'avatar'],
                }).then((user) => {
                    resolve(user)
                    
                }).catch((err) => {
                    res.status(500).json({
                        message: ' Something Went wrong, Please try again', 
                        hint:err,
                    })
                })
            }))
            
            Promise.all(reqPromise)
            .then((user) => {
                
                res.status(200).json({
                    status: 'success',
                    message:'Pending Friend request',
                    data: {
                        user,
                        requestIds
                    }
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Something went wrong, Please try again',
                    hint: err
                })
            })
            
        }
    }).catch((err)=>{
        res.status(500).json({
            message: ' Something Went wrong, Please try again', 
            hint:err,
        })
    })

});


//VIEW FRIEND RECEIVED
router.get('/viewrequestreceived', async (req, res) => {
    let userId = await getUserId(req);

    // Get all Frined request sent to signed in user 
    Requests.findAll({
        where:{
            requestee_id: userId,
            status:'pending',
        }
    }).then((requests)=>{
        if (!requests){
            res.status(404).json({
                message:'No Pending Friend Requests for this user'
            })
        }else{
            //Get the Id of all the people that you sent a friend request
            let allRequesterId = [];
            //Get the request Id from the request table
            let requestIds = [];
            
            requests.map( (item) => {
                allRequesterId.push(item.dataValues.requester_id)
                requestIds.push(item.dataValues.id)
            })

            let reqPromise = allRequesterId.map(requester_id => new Promise((resolve, reject) => {
                Users.findOne({
                    where: { id: requester_id },
                    attributes: ['id', 'firstname', 'lastname', 'gender', 'state', 'avatar'],
                }).then((user) => {
                    resolve(user)
                    
                }).catch((err) => {
                    res.status(500).json({
                        message: ' Something Went wrong, Please try again', 
                        hint:err,
                    })
                })
            }))
            
            Promise.all(reqPromise)
            .then((user) => {  
                res.status(200).json({
                    status: 'success',
                    message:'Pending Friend request',
                    data: {
                        user,
                        requestIds
                    }
                })
            }).catch((err) => {
                res.status(500).json({
                    message: 'Something went wrong, Please try again',
                    hint: err
                })
            })
        }

}).catch((err) =>{
    res.status(500).json({
        message:'Something Went wrong please try again',
        hint: err
    })
})

});


//ACCEPT FRIEND REQUEST
router.patch('/acceptfriendrequest/:requestid', async (req, res) =>{
    let userId = await getUserId(req);
    let id = req.params.requestid;

    Requests.findOne({
        where:{
            id: id, 
            requestee_id: userId,
            status: 'pending',
        }

    }).then((requests) => {
        if(!requests){
            res.status(404).json({
                message: 'Request does not exist check and try again'
            })
        }else {
            Requests.update({
                status:'accepted',
            }, {
                where:{ id }
            }
            
            ).then((request) => {
                const requestee_id = requests.requestee_id;
                const requester_id = requests.requester_id;
                
                Friends.create({
                    requestee_id,
                    requester_id,
                    status: 'active',
                }).then((friends) => {
                   
                    res.status(201).json({
                        message:'Friend Request accepted',
                        data: friends,
                    })
                    Requests.destroy({
                        where:{id}
                        });
                });

              
            }).catch((err) => {
                res.status(500).json({
                    message:'Something went wrong please try again',
                    hint: err,

                });

            });
        }

    })
    
});

//REJECT FRIEND REQUEST
router.delete('/rejectfriendrequest/:requestid', async (req, res) =>{
    const id = req.params.requestid;
    const userId = await getUserId(req);
    // Find Request 
    Requests.findOne({
        where:{ id, 
        requestee_id: userId, 
        status: 'pending'
    }
    }).then((requests)=> {
        if(!requests){
            res.status(404).json({
                message:'Friend Request does not exist'
            })


        }else{
            res.status(200).json({
                message:'Friend Request has been rejected successfully', 
            });
            Requests.destroy({
                where:{id}
            });

        }
    }).catch((err) => {
        res.status(500).json({
            message:'Something went wrong please try again',
            hint: err,
        })
    })
});


//CANCEL A FRIEND REQUEST
router.delete('/cancelfriendrequest/:requestid', async (req, res) => {
    const id = req.params.requestid;
    const userId = await getUserId(req);
    // Find Request 
    Requests.findOne({
        where:{ id, 
        requester_id: userId, 
        status: 'pending'
    }
    }).then((requests)=> {
        if(!requests){
            res.status(404).json({
                message:'Friend Request does not exist'
            })

        }else{
            res.status(200).json({
                message:'Friend Request has been cancelled successfully', 
            });
            Requests.destroy({
                where:{id}
            });

        }
    }).catch((err) => {
        res.status(500).json({
            message:'Something went wrong please try again',
            hint: err,
        })
    })


});

module.exports = router
