import express from 'express';
import UserController from '../app/controller/UserController.js';
import verifyToken from '../app/middleware/verifyToken.js';
const router = express.Router();
router.post('/register', UserController.Register);
router.post('/login', UserController.Login);
router.post('/forget', UserController.forgetPassword);
router.post('/change', verifyToken,UserController.updateUser);
export default router;