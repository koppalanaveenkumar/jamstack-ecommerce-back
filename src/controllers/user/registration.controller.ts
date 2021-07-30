import { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import config from "../../config";
import userModel from "../../models/user/user.model";
import moment from "moment";

export default class UserController{
    public createToken = (user : any) => {
        const expiresIn = 60 * 60;
        const dataStoredToken = {
            _id : user._id,
            time: user["lastLogginIn"],
            isAdmin: true
        }
        return sign(dataStoredToken, config.USER_JWT_SECRET, { expiresIn })
    }

    public addUser = async (req: Request, res: Response) =>{
        if(req.body.secret == "jamstack") {
            try{
                const email = await userModel.findOne({ 
                    email: req.body.email 
                });
                if(email) {
                    res.status(409).json({ email: true })
                } else {
                    const hashPassword = await bcrypt.hashSync(req.body.password, 10);
                    const requestBody = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phoneNo: req.body.phoneNo,
                        password: hashPassword,
                        lastLoggedIn: moment().unix()
                    };
                    const user : any = await userModel.create(requestBody);
                    if(user){
                        res.status(201).json("Done");
                    }
                }
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(409).json({secret:true});
        }
    }
    
    public authenticate = async (req: Request, res: Response) =>{
        try{
            const userEmail : any = await userModel.findOne({email: req.body.email});
            if(userEmail){
                const comparePassword = await bcrypt.compareSync(req.body.password, userEmail['password']);
                if(comparePassword){
                    const updateTimesstamp = await userModel.findOneAndUpdate(
                        {_id: userEmail['_id']}, 
                        { $set: { lastLoggedIn: moment().unix() }},
                        { new: true}
                )
                    if(updateTimesstamp){
                        const tokenData = this.createToken(updateTimesstamp);
                        res.status(200).json({auth: true, tokenData: tokenData, email : userEmail['email']});
                    }
                } else{
                    res.status(409).json({password: true});
                }
            } else {
                res.status(409).json({username: true})
            }
        } catch (err) {
            res.status(409).json(err);
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

    // public changePassword = async (req: any, res: Response) => {
    //     try{
    //         const userEmail: any = await userModel.findOne({email: req.body.email});
    //         if(userEmail){
    //             if(bcrypt.compareSync(req.body.currentPassword, userEmail.password)){
    //                 let updateUser = await userModel.updateOne({email: req.body.email}, {$set:{password: bcrypt.hashSync(req.body.newPassword, 10)}}, {new : true});
    //                 if(updateUser){
    //                         res.status(200).json("Password updated Successfully")
    //                 } else {
    //                     res.status(401).json({status: "Failed in update password"})
    //                 }
    //             } else {
    //                 res.status(401).json({currentPassword: true});
    //             }
    //         } else {
    //             res.status(409).json({email: true})
    //         } 
    //     } catch (err){
    //         console.log(err)
    //         res.status(500).json(err);
    //     }
    // }

}