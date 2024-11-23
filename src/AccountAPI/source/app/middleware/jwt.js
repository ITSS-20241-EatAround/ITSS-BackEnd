import jwt from 'jsonwebtoken';
const genAccessToken = (id, name, email) => jwt.sign(
    {
        id: id,
        name: name,
        email: email
    },
    process.env.SECRET_KEY,
    {
        expiresIn: '3d'
    }
);

export default genAccessToken;