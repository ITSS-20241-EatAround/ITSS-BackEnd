import User from '../model/user.js';
import bcrypt from 'bcrypt';
import genAccessToken from '../middleware/jwt.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';  // Đọc file html

class UserController{
    async Register(req, res){
        const {email, name, password} = req.body;
        if(!email || !name | !password){
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
            name: name,
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
                const resetToken = jwt.sign(
                    {id: existEmail.id},
                    process.env.RESET_TOKEN_SECRET_KEY,
                    {expiresIn: '30m'}
                );
                const html = await fs.readFile('../../template/resetPassword.html', 'utf-8');
                const emailBody = html.replace('{{resetLink}}', `http://localhost:3000/api/resetPassword/${resetToken}`)
                //Gọi đến api localhost:7200/api/v1/mail
                const response = await fetch('http://localhost:7200/api/v1/mail', {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        toEmail: email,
                        subject: 'Password Reset Request',
                        body: emailBody
                    })
                });
                if(!response.ok){
                    throw new Error(`API returned an error: ${response.status} ${response.statusText}`);
                }
                return res.status(200).json({
                    success: true,
                    message: 'Email sent successfully.',
                    resetToken: passwordResetToken,
                    content: data.content
                })
            } 
            }   catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'System error. Unable to send email.',
                });
            }
        }
    
    async changePassword(req, res){
        const{password, resetToken} = req.body;
        if (!resetToken || !passwordassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide reset token and new password."
            });
        }
        try {
            const decode = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET_KEY);
            if(!decode){
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired reset token."
                });
            }
            await User.update({password:password}, {where: {email: decode.email}});
            return res.status(200).json({
                success: true,
                message: 'Password has been reset successfully.'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'System error. Unable to reset password.'
            });
        }
    }
}

export default new UserController;