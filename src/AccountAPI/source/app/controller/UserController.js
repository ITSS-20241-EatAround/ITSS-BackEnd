import User from '../model/user.js';
import bcrypt from 'bcrypt';
import genAccessToken from '../middleware/jwt.js';
import { Op } from 'sequelize';

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserController{
    async Register(req, res){
        const {email,  password, name} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({success: false,message: "Please fill in all fields."});
        }

        const existEmail = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { name: name }
                ]
            }
        });
        if(existEmail !== null){
            return res.status(409).json({
                success: false,
                message: "Email or username already exists."
            });
        };

        await User.create({
            name : name,
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
            where: {
                [Op.or]: [
                    { email: email },
                    { name: email }
                ]
            }
        });
        
        if(existEmail === null){
            return res.status(409).json({
                success: false,
                message: "Name does not exist."
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
                const salt = await bcrypt.genSalt(10);
                const psw = await bcrypt.hash(newPassword, salt);
                await User.update(
                    { password: psw },
                    { where: { email: email },
                    individualHooks: true },
                    
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
    
    async updateUser(req, res){
        const { newPassword, newName, currentPassword } = req.body;
        const user = req.user; 
        //console.log(email)
        if(!newPassword || !currentPassword){
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields.'
            })
        }
        try {
            const userUpdate = await User.findOne({where: {
                email: user.email,
            }});
            console.log(userUpdate.password)
            const isPassword = bcrypt.compareSync(currentPassword, userUpdate.password);
            const findName = await User.findOne({where: {
                name: newName
            }});
            const isName = findName !== null;
            if(!isPassword || isName){
                return res.status(401).json({
                    success: false,
                    message: 'Current password wrong or Name exist',
                });
            }
            await User.update({
                password: newPassword,
                name: newName
            },
            {
                where: {
                    email: user.email
                },
                individualHooks: true
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