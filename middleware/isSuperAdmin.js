const jwt = require('jsonwebtoken');
//const client = require('../database/dbconnect')

//Import Model
const Admins = require('../models/Admins')

const isSuperAdmin = (req, res, next) => {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if the bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken
        
       jwt.verify(req.token, process.env.SECRET_TOKEN, (err, decode) => {
           if(err){
                res.status(403).json({
                    message: 'Access denied'
                });
            }
           
            Admins.findOne({
                where: { email: decode.email}
            }).then( (user) => {
                if(!user){
                   return res.status(200).json({
                        message: 'Invalid user token'
                    }) 
                }
                if(user.admin_type !== 'super admin'){
                    return res.status(200).json({
                        message: 'Sorry, You Are Not Authorized For This Action'
                    })
                }
                next();
            }).catch( (error) => {
                res.status(500).json({
                    message: "Something went wrong, please try again later"
                })
            })
       });
       
    }else {
        res.status(403).json({
            message: 'Access denied'
        });
    }
         
};

module.exports = isSuperAdmin