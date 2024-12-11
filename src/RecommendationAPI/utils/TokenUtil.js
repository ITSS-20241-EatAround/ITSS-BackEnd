const jwt = require('jsonwebtoken');

module.exports = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    return {
        id : payload.id,
        email : payload.email,
        name : payload.name
    }
}