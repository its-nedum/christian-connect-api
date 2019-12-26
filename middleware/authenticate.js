const jwt = require('jsonwebtoken');
 
const verifyToken = (req, res, next) => {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if the bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken

        jwt.verify(req.token, process.env.SECRET_TOKEN, (err) => {
            if(err){
                res.status(403).json({
                    message: 'Access denied'
                });
            }else{
                next();
            }
        })
    } else {
        res.status(403).json({
            message: 'Access denied'
        });
    }
};

module.exports = verifyToken