const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    let adminName = [];
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
        if(err){
            let { message } = err;
            if(message == 'jwt expired'){
              return  res.status(401).json({
                    message: 'Token expired'
                })
            }
        }
        adminName.push(decodedToken.name);
    });
    return adminName[0]
}