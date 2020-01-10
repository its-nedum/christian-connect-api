const jwt = require('jsonwebtoken');

module.exports = async (req) => {
    let authToken = req.headers.authorization;
    if(typeof authToken !== 'undefined'){
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        return decodedToken.name;
    }else{
        return 'Anonymous';
    }
}