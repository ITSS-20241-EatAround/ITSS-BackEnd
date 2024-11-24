import express from 'express';
import UserController from '../app/controller/UserController.js';
const router = express.Router();
router.post('/register', UserController.Register);
router.post('/login', UserController.Login);
router.post('/forget', UserController.forgetPassword);
router.post('/change', UserController.changePassword);
export default router;