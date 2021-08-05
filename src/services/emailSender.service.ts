const nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
import config from '../config';

class EmailSenderService {
    private sgConfig = {
        auth: {
            service : config.SERVICE_PORVIDER,
            api_key: config.SEND_GRID_API_KEY,
        }
    };

    private transporter = nodemailer.createTransport(sgTransport(this.sgConfig));
    public sendEmail = (data: any, token?: any)=>{
        return new Promise((resolve, reject) => {
            try{
                let mailOptions : any = {
                    to: data.email,
                    from: config.SENDER_EMAIL,
                    subject: '',
                    html: ''
                };
                if(data.type === 'resetPassword') {
                    const resetLink = `${config.FRONT_END_URL}/#auth/resetPassword?token=${token}&email=${data.email}`;
                    const logoPath : any = `${config.FRONT_END_URL}/assets/images/logo.png`;
                    mailOptions.subject = 'Jamstack Reset Password';
                    mailOptions.html = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        <style>
                            div{
                                text-align: center;
                                background-color: #fff;
                                color: #5D5D5D;
                            }
                            img {
                                margin: 30px 0px 20px 0px;
                            }
                            .content h2{
                                text-align: left;
                            }
                            .content{
                                width: 60%;
                                margin: auto;
                            }
                            div p{
                                text-align: justify;
                                font-size: 13px;
                                color: #5D5D5D;
                                font-size: 18px;                                
                            }
                            .link a{
                                font-size: 22px;
                                color: #fff;
                                background-color: #E8BD1F;
                                padding: 10px 20px;
                                border-radius: 8px;
                            }   
                            .link{
                                padding: 30px 0px 45px 0px;
                            }                                         
                        </style>
                    </head>
                    <body>
                        <div>
                            <img src="${logoPath}">
                            <div class="content">
                                <h2>Hi ${data.firstName}, </h2>
                                <p> A password reset for your account was requested.
                                    Please click the link below to change your password.
                                    Note that this link is valid for 24 hours.After the time
                                    limit is expired, you will have to resubmit the request
                                    for a password reset.</p>
                            </div>
                            <div class="link">
                                <a href="${resetLink}"> RESET YOUR PASSWORD</a>
                            </div>
                        </div>
                    </body>
                    </html> 
                    `
                } 
                this.transporter.sendMail(mailOptions, (error: any, info: any)=>{
                    if(error) {
                        throw error;
                    } else {
                        resolve(info);
                    }
                })
            } catch (error){
                reject(error);
            }
        })
    }
}

export const emailSenderService: EmailSenderService = new EmailSenderService();