const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    let authToken = req.headers.authorization;
    if(typeof authToken !== undefined || req.headers.authorization.split(' ')[1] !== null){
    let username = [];
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
        if(err){
            let { message } = err;
            if(message == 'jwt expired'){
              return res.status(401).json({
                    message: 'Token expired'
                })
            }
        }
        username.push(decodedToken.name)
    })
    return username[0]
    }else{
        return 'Anonymous';
    }
}