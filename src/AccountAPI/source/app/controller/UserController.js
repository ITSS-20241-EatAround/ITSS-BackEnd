import User from '../model/user.js';
import bcrypt from 'bcrypt';
import genAccessToken from '../middleware/jwt.js';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserController{
    async Register(req, res){
        const {email,  password} = req.body;
        if(!email || !password){
            return res.status(400).json({success: false,message: "Please fill in all fields."});
        }

        const existEmail = await User.findOne({
            where: {email: email}
        });
        if(existEmail !== null){
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        };

        const newUser = await User.create({
            email: email,
            password: password
        });
        return res.status(200).json({
            success: true,
            message: "Created successfully."
        });
    }
    async Login(req, res){
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please fill in all fields."});
        }
        //Kiểm tra email
        const existEmail = await User.findOne({
            where: {email: email}
        })
        if(existEmail === null){
            return res.status(409).json({
                success: false,
                message: "Email does not exist."
            });
        } else {
            try {
                const isPassword = bcrypt.compareSync(password, existEmail.password)
                if(!isPassword){
                    return res.status(401).json({message: "Wrong Password"});
                } else {
                    const accessToken = genAccessToken(existEmail.id, existEmail.name, existEmail.email);
                    return res.status(200).json({
                        success: true,
                        message: "Sign in successfully",
                        accessToken: accessToken
                    })
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message
                })
            }
        }
    }
    async forgetPassword(req, res){
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message: "Please fill in all fields."});
        };
        try {//Kiểm tra email
            const existEmail = await User.findOne({
                where: {email: email}
            });
            if(existEmail === null){
                return res.status(409).json({
                    success: false,
                    message: "Email does not exist."
                });
            } else {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                const length = 8;
                let newPassword = '';
                for(let i = 0; i < length; i++){
                    newPassword = newPassword + chars.charAt(Math.floor(Math.random()*chars.length));
                }
                await User.update(
                    { password: newPassword },
                    { where: { email: email } }
                );
                const htmlPath = path.resolve(__dirname, '../../template/resetPassword.html');
                const html = await fs.readFile(htmlPath, 'utf8');
                var emailBody = html.replace('{{newPassword}}', newPassword)
                emailBody = emailBody.replace('{{user}}',email);
                //Gọi đến api localhost:7200/api/v1/mail
                const response = await fetch('http://localhost:7200/api/v1/mail', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        toEmail: email,
                        subject: 'Your New Password',
                        body: emailBody
                    })
                });
                if(!response.ok){
                    throw new Error(`API returned an error: ${response.status} ${response.statusText}`);
                }
                return res.status(200).json({
                    success: true,
                    message: 'Email sent successfully.',
                    content: 'Change Password successfully.'
                })
            } 
            }   catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'System error. Unable to send email.'
                });
            }
        }
    
    async changePassword(req, res){
        const newPassword = req.body;
        const currentPassword = req.body;
        const email = req.user; //lấy email từ jwt gửi từ người dùng
        try {
            const userChangePassword = await User.findOne({where: {
                email: email,
            }});
            const isPassword = bcrypt.compareSync(currentPassword, userChangePassword.password);
            if(!isPassword){
                return res.status(401).json({
                    success: false,
                    message: 'Current password wrong.',
                });
            }
            await User.update({
                password: newPassword
            },
            {
                where: {
                    email: email
                }
            }
            );
            return res.status(200).json({
                success: true,
                message: 'Password changed successfully.'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'System error. Unable to change password.',
                error: error.message
            })
        }
    }
}
export default new UserController;