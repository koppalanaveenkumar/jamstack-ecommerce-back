import { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import config from "../../config";
import userModel from "../../models/user/user.model";
import moment from "moment";
import { commonService } from "../../services/common.service";
import { emailSenderService } from "../../services/emailSender.service";

export default class UserController{
    public createToken = (user : any) => {
        const expiresIn = 60 * 60;
        const dataStoredToken = {
            _id : user._id,
            time: user["lastLogginIn"]
        }
        return sign(dataStoredToken, config.USER_JWT_SECRET, { expiresIn })
    }

    public addUser = async (req: Request, res: Response) =>{
        try{
            const email = await userModel.findOne({ email: req.body.email });
            if(email) {
                res.status(406).json({ email: true })
            } else {
                const phoneNo = await userModel.findOne({ phoneNo: req.body.phoneNo });
                if(phoneNo) {
                    res.status(406).json({ phoneNo: true }) 
                }
                else {
                        const hashPassword = await bcrypt.hashSync(req.body.password, 10);
                        const requestBody = {
                        ...req.body,
                        password: hashPassword,
                        lastLoggedIn: moment().unix(),
                        lastUpdatedAt: Date.now()
                    };
                    const user : any = await userModel.create(requestBody);
                    if(user){
                        res.status(201).json("Done");
                    }
                }
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    
    public authenticate = async (req: Request, res: Response) =>{
        try{
            const user: any = await userModel.findOne({$or: [{email: req.body.email}, {phoneNo: req.body.phoneNo}]});
            if(user) {
                const comparePassword = await bcrypt.compareSync(req.body.password,user['password']);
                if(comparePassword) {
                    const updateTimesstamp = await userModel.findOneAndUpdate(
                        { _id: user["_id"]},
                        { $set: { lastLoggedIn: moment().unix()} },
                        { new: true }
                    );
                    if(updateTimesstamp) {
                        const tokenData =this.createToken(updateTimesstamp);
                        res.status(200).json({
                            auth: true,
                            token: tokenData,
                            email: user["email"],
                            user: user["firstName"]  + " " + user["lastName"],
                            isUser: user["isUser"],
                            isActive: user["isActive"]
                        });
                    }
                } else {
                    res.status(409).json( {password: true} );
                    console.log(Error)
                }
            } else {
                res.status(409).json({userEmail: true})
                console.log(Error)
            }
        } catch (error){
            res.status(500).json(error);
        }
    };


    public userCheck = async (req: any, res: Response) => {
        try{
            const user: any = await userModel.findById(req['tokenId']);
            if(user){
                res.status(200).json({
                    email: user["email"],
                    user: user["firstName"]  + " " + user["lastName"],
                    isActive: user["isActive"],
                    isUser: user["isUser"]
                });
            } else {
                res.status(401).json({username: true});
            }
        } catch (err){
            console.log(err)
            res.status(500).json(err);
        }
    }

    public changePassword = async (req: any, res: Response) => {
        try{
            const user: any = await userModel.findById(req['tokenId']);
            if(user){
                if(bcrypt.compareSync(req.body.currentPassword, user.password)){
                    let updateUser = await userModel.updateOne({_id: req['tokenId']}, {$set:{password: bcrypt.hashSync(req.body.newPassword, 10)}}, {new : true});
                    if(updateUser){
                            res.status(200).json("Password updated Successfully")
                    } else {
                        res.status(401).json({status: "Failed in update password"})
                    }
                } else {
                    res.status(401).json({currentPassword: true});
                }
            } else {
                res.status(409).json({username: true})
            } 
        } catch (err){
            console.log(err)
            res.status(500).json(err);
        }
    }


    public sendEmail = async (req:Request, res:Response) => {
        try{
            const user = await userModel.findOne({email: req.body.email});
            if(user){
                const token = await commonService.generateRandomBytes();
                const updateUser: any = await userModel.findByIdAndUpdate(
                    {_id: user["_id"]},
                    {
                        resetPasswordToken : token,
                        resetPasswordExpires: Date.now() + 86400000,
                    },
                    { upsert: true, new: true },
                    );
                    if(updateUser){
                        updateUser.type = "resetPassword";
                        await emailSenderService.sendEmail(updateUser, token);
                        res.status(200).json({status: 1, data: { message: "Sent Successfully"}});
                    } else {
                        res.status(409).json({status: 0, data: { message: "Failed in sending email, Try again"}});
                    }
            } else {
                res.status(401).json({status: 0, data: { message: "Email not found"}})
            }
        } catch (err){
            console.log(err);
            res.status(500).send(err);
        }
    }

    // public resetPassword = async (req: Request, res: Response) =>{
    //     try{
    //         const user: any = await userModel.findOne({
    //             resetPasswordToken : req.body.token,
    //             resetPasswordExpires : { $gt:Date.now()}
    //         });
    //         if(user) {
    //             const hashedPassword = await bcrypt.hashSync(req.body.newPassword, 10);
    //             if(hashedPassword) {
    //                 const updatedUser = await userModel.findByIdAndUpdate(
    //                     { _id: user["_id"]},
    //                     {
    //                         $set: {
    //                             password: hashedPassword,
    //                             resetPasswordToken : undefined,
    //                             resetPasswordExpires : undefined,
    //                         },
    //                     },
    //                     { upsert: true, new: true}
    //                 );
    //                 if(updatedUser) {
    //                     res.status(200).json({
    //                         status: 1, data : {message: "Password updated successfully"}
    //                     })
    //                 }
    //             }
    //         } else {
    //             console.log(Error)
    //             res.status(200).json({
    //                 status: 0, 
    //                 data : {
    //                     errorDescription: "Password reset token is invalid or has expired.",
    //                     error: "expired_token",
    //                 }
    //             })
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json(error);
    //     }
    // }
}