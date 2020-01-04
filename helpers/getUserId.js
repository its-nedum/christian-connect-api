const jwt = require('jsonwebtoken');

module.exports = async (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    return decodedToken.userId;
}