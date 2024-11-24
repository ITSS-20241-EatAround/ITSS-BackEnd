import express from 'express';
import UserController from '../app/controller/UserController.js';
const router = express.Router();
//http://localhost:3000/user/api/register
/*
    {
        "name": "",
        "email": "",
        "password": "",
    }
*/
router.post('/register', UserController.Register);

//http://localhost:3000/user/api/login  (trả về accessToken)
/*
    {
        "email": "",
        "password": "",
    }
*/
router.post('/login', UserController.Login);

//http://localhost:3000/user/api/forget (trả về resetToken)
/*
    {
        "email": ""
    }
*/
router.post('/forget', UserController.forgetPassword);

//http://localhost:3000/user/api/change
/*
    {
        "password": "",
        "resetToken": ""
    }
*/
router.post('/change', UserController.changePassword);
export default router;