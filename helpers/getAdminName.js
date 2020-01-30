const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
        if(err){
            let { message } = err;
            if(message == 'jwt expired'){
                res.status(401).json({
                    message: 'Token expired'
                })
            }
        }
    return decodedToken.name;
    });
}