import User from '../model/user.js';
import bcrypt from 'bcrypt';
import genAccessToken from '../middleware/jwt.js';
import CryptoJS from "crypto-js";

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
                message: "Email đã tồn tại."
            });
        };

        const newUser = await User.create({
            email: email,
            name: name,
            password: password
        });
        return res.status(200).json({
            success: true,
            message: "Tạo mới thành công."
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
                message: "Email không tồn tại."
            });
        } else {
            try {
                const isPassword = bcrypt.compareSync(password, existEmail.password)
                if(!isPassword){
                    return res.status(401).json({message: "Sai mật khẩu."});
                } else {
                    const accessToken = genAccessToken(existEmail.id, existEmail.name, existEmail.email);
                    return res.status(200).json({
                        success: true,
                        message: "Đăng nhập thành công.",
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
        //Kiểm tra email
        const existEmail = await User.findOne({
            where: {email: email}
        });
        if(existEmail === null){
            return res.status(409).json({
                success: false,
                message: "Email không tồn tại."
            });
        } else {
            try {
                const resetToken = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
                const passwordResetToken = CryptoJS.SHA256(resetToken).toString(CryptoJS.enc.Hex);

                await User.update({
                    passwordResetToken: passwordResetToken,
                }, {
                    where: {email: email}
                });
                //Gọi đến api localhost:7200/api/v1/mail
                const response = await fetch('http://localhost:7200/api/v1/mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({sendTo: email})
                });
                if(!response.ok){
                    throw new Error(`API trả về lỗi: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (!data.content) {
                    throw new Error('Kết quả trả về từ API không hợp lệ (thiếu content)');
                }
                return res.status(200).json({
                    success: true,
                    message: 'Email gửi thành công',
                    resetToken: passwordResetToken,
                    content: data.content
                })
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi hệ thống. Không thể gửi email.',
                });
            }
        }
    }
    async changePassword(req, res){
        const{password, resetToken} = req.body;
        const passwordResetToken = CryptoJS.SHA256(resetToken).toString(CryptoJS.enc.Hex)
        const user = await User.findOne({passwordResetToken: passwordResetToken})
        if(user === null){
            return res.status(404).json({
                success: false,
                message: "Có lỗi xảy ra"
            })
        } else {
            user.passwordResetToken = null
            user.password = password
            await user.save()
            return res.status(200).json({
                success: user ? true:false,
                message: "Thay đổi mật khẩu thành công!"
            })
        }
    }
}

export default new UserController;