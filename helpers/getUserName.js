const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    let authToken = req.headers.authorization;
    let token = authToken.split(' ')[1];
    
    switch (token) {
        case 'null':
                return 'Anonymous';
            break;
        case 'undefined':
                return 'Anonymous';
            break;
        default:
            let username = [];
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
            break;
    }

    
}