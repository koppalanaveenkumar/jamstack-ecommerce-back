import { Request, Response, NextFunction } from 'express';
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

import config from "../../config";
import adminModel from '../../models/admin/admin.model';
import bcrypt from 'bcryptjs'
import orderModel from '../../models/order/order.model';
import userModel from '../../models/user/user.model';
import moment from 'moment';

export default class AdminController{
    public createToken = (user: any) => {
        const expiresIn = 60 * 60;
        const dataStoredInToken = {
            _id: user._id,
            time: user["lastLogginIn"],
            isAdmin: true
        }
        return sign(dataStoredInToken, config.ADMIN_JWT_SECRET, { expiresIn })
    }
    public createAdmin = async (req: Request, res: Response) => {
        if(req.body.secret == "jamstack"){
            try{
                const email = await adminModel.findOne({
                    email: req.body.email
                })
                if(email) {
                    res.status(409).json({email: true})
                } else {
                    const hashedPassword = await bcrypt.hashSync(req.body.password, 10)
                    const requestBody = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword,
                        lastLoggedIn: moment().unix()
                    };
                    const user: any = await adminModel.create(requestBody);
                    if (user) {
                        res.status(201).json("done");
                    }
                }
            } catch (error) {
                    res.status(500).json(error);
            }
        } else {
            res.status(409).json({ secret: true });
        }
    }

    public authenticate = async (req: Request, res: Response) =>{
        try{
            const userEmail: any = await adminModel.findOne({email: req.body.email});
            if(userEmail) {
                const comparePassword = await bcrypt.compareSync(req.body.password,userEmail['password']);
                if(comparePassword) {
                    const updateTimesstamp = await adminModel.findOneAndUpdate(
                        { _id: userEmail["_id"]},
                        { $set: { lastLoggedIn: moment().unix()} },
                        { new: true }
                    );
                    if(updateTimesstamp) {
                        const tokenData =this.createToken(updateTimesstamp);
                        res.status(200).json({
                            auth: true,
                            token: tokenData,
                            email: userEmail["email"],
                        });
                    }
                } else {
                    res.status(409).json( {password: true} );
                }
            } else {
                res.status(409).json({userEmail: true})
            }
        } catch (error){
            res.status(500).json(error);
        }
    };

    public changePassword = async (req: any, res: Response) => {
        try{
            const user: any = await adminModel.findById(req['tokenId']);
            if(user){
                if(bcrypt.compareSync(req.body.currentPassword, user.password)){
                    let updateUser = await adminModel.updateOne({_id: req['tokenId']}, {$set:{password: bcrypt.hashSync(req.body.newPassword, 10)}}, {new : true});
                    if(updateUser){
                            res.status(200).json("Password updated Successfully")
                    } else {
                        res.status(401).json({status: "Failed in updated password"})
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




    // Users List
    public allUsers = async(req: Request, res: Response)=>{
        try{
            const users: any = await userModel.find();
            if(users){
                res.status(200).json(users);
            } else {
                res.status(409).json({orderId: true})
            }
        } catch(err){
            res.status(500).json(err);
        }
    }

    public getUserById = async(req: Request, res: Response)=>{
        try{
            const user: any = await userModel.findById(req.params.userId);
            if(user){
                res.status(200).json(user);
            } else {
                res.status(409).json({user: true})
            }
        } catch(err){
            res.status(500).json(err);
        }
    } 

    public userOrderListGetById = async(req: Request, res: Response)=>{
        try{
            const user: any = await userModel.findById({_id:req.body._id});
            if(user){
                let orderSid = await orderModel.find({})
                res.status(200).json(orderSid);
            } else {
                res.status(409).json({orderId: true})
            }
        } catch(err){
            res.status(500).json(err);
        }
    }    
}