import nodemailer from 'nodemailer';
const sendmail = async({email, html}) => {
    let transposter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.APP_PASSWORD
        }
    });
    let info = await transposter.sendMail({
        from: process.env.EMAIL_NAME,
        to: email,
        subject: 'Change your password',
        html: html
    });
    return info;
}

export default sendmail;