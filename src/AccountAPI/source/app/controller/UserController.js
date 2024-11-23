import User from '../model/user.js';
import bcrypt from 'bcrypt';
import genAccessToken from '../middleware/jwt.js';
import CryptoJS from "crypto-js";
import sendmail from '../util/sendmail.js';
class UserController{
    async Register(req, res){
        const {email, name, password} = req.body;
        if(!email || !name | !password){
            return res.status(400).json({message: "Please fill in all fields."});
        }
        //Kiểm tra email có tồn tại
        const existEmail = await User.findOne({
            where: {email: email}
        });
        if(existEmail !== null){
            return res.status(400).json({message: "Email đã tồn tại."});
        };
        //Tạo mới user
        const newUser = await User.create({
            email: email,
            name: name,
            password: password
        });
        return res.status(201).json({message: "Tạo mới thành công."});
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
            return res.status(400).json({message: "Email không tồn tại."});
        } else {
            try {
                const isPassword = await bcrypt.compareSync(password, existEmail.password)
                if(!isPassword){
                    return res.status(400).json({message: "Sai mật khẩu."});
                } else {
                    const accessToken = genAccessToken(existEmail.id, existEmail.name, existEmail.email);
                    return res.status(200).json({
                        message: "Đăng nhập thành công.",
                        accessToken: accessToken
                    })
                }
            } catch (error) {
                return res.status(500).json({message: error.message})
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
            return res.status(400).json({message: "Email không tồn tại."});
        } else {
            const resetToken = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
            const passwordResetToken = CryptoJS.SHA256(resetToken).toString(CryptoJS.enc.Hex);
            const passwordResetExpires = Date.now() + 10*60*60;
            await User.update({
                passwordResetToken: passwordResetToken,
                passwordResetExpires: passwordResetExpires
            }, {
                where: {email: email}
            });
            const html = `Click vào link để đổi mật khẩu. Link sẽ hết hạn sau 10 phút. <a href=${process.env.URL_SERVER}/login/resetpass/${resetToken}>Click</a>`
            const data = {
                email, html
            };
            const rs = await sendmail(data);
            return res.status(200).json({
                message:"mail đã được gửi", 
                link: `${process.env.URL_SERVER}/login/resetpass/${resetToken}`,
                resetToken
            })
        }
    }
    async changePassword(req, res){
        const{password, resetToken} = req.body;
        const passwordResetToken = CryptoJS.SHA256(resetToken).toString(CryptoJS.enc.Hex)
        const user = await User.findOne({passwordResetToken: passwordResetToken, passwordResetExpires: {
            $gt: Date.now()
        }})
        if(user === null){
            const expiredUser = await User.findOne({passwordResetToken: passwordResetToken})
            if(expiredUser !== null){
                expiredUser.passwordResetToken = null
                expiredUser.passwordResetExpires = null
                await expiredUser.save()
            }
            return res.status(400).json({
                message: "Link hết hạn"
            })
        } else {
            user.passwordResetToken = null
            user.passwordResetExpires = null
            user.password = password
            await user.save()
            return res.status(200).json({
                success: user ? true:false,
                message: "change password successfully"
            })
        }
    }
}

export default new UserController;