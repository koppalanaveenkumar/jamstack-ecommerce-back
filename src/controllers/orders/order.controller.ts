import { Request, Response, NextFunction } from "express";
import adminModel from "../../models/admin/admin.model";
import userModel from "../../models/user/user.model";
import orderModel from "../../models/order/order.model";
import addCategoryModel from "../../models/category/addCategory.model";
import userCartModel from "../../models/order/userCart.model";
import { sign, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
// import { Promise } from "mongoose";
import config from "../../config";

export default class OrderController{
    public createToken = (order: any) =>{
        const expiresIn = 60 * 60;
        const dataStoreInToken = {
            _id: order._id,
            time: order['lastLoggedIn'],
            isAdmin: true
        };
        return sign(dataStoreInToken, config.USER_JWT_SECRET, { expiresIn})
    };
    
    public order = async (req: Request, res: Response)=>{
        let orders = new orderModel(req.body)
        try{
            let order = await orders.save();
            if(order){
                res.status(201).json('done')
            }
            else{
                res.status(404).json({message : "Something went wrong"})
            }
        } catch(err){
            console.log(err);
            res.status(500).json(err);
        } 
    }

    public getUserOrders = async(req: Request, res: Response) =>{
        try{
            const user = await orderModel.find({userId: req.body.userId});
            if(user){
                res.status(200).json(user);
            } else {
                res.status(409).json({user: true})
            }
        } catch(err){
            res.status(500).json(err);
        }
    }

    public addCart = async (req: Request, res: Response) => {
        let orders = new userCartModel(req.body)
        try{
            let order = await orders.save();
            if(order){
                res.status(201).json('done')
            }
            else{
                res.status(404).json({message : "Something went wrong"})
            }
        } catch(err){
            console.log(err);
            res.status(500).json(err);
        } 
    }

    public getUserCart = async(req: Request, res: Response) =>{
        try{
            const user = await userCartModel.find({userId: req.body.userId});
            if(user){
                res.status(200).json(user);
            } else {
                res.status(409).json({user: true})
            }
        } catch(err){
            res.status(500).json(err);
        }
    }

    public deleteCartById = async (req: Request, res: Response) => {
        try{
            const cartId = await userCartModel.findByIdAndDelete({_id: req.body._id})
            if(cartId) {
                res.status(200).json({status: "delete"});
            } else {
                res.status(409).json({cartId: true})
            }
        } catch(err){
            res.status(500).json(err);
        }
    }

}