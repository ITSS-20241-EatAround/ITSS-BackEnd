import jwt from 'jsonwebtoken';

async function verifyToken(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token){
        return res.status(401).send({message: 'AccessToken is missing'});
    };
    try {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
            if(err){
                return res.status(401).send({message: 'Invalid token'});
            }
            req.user = decode;
            next()
        })
    } catch (error) {
        return res.status(401).send({message: error.message});
    }
}
export default verifyToken;