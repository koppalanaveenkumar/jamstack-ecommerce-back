import { Request, Response, NextFunction } from "express";
import adminModel from "../../models/admin/admin.model";
import userModel from "../../models/user/user.model";
import orderModel from "../../models/order/order.model";
import productModel from "../../models/category/product.model";
import userCartModel from "../../models/order/userCart.model";
import { sign, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
// import { Promise } from "mongoose";
import config from "../../config";
import { Types } from "mongoose";

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
    
    public createOrder = async (req: any, res: Response) =>{
        try{
            const userDetails : any = await userModel.findById(req["tokenId"], {password: 0,});
            if(userDetails) {
                    const order = await orderModel.create({
                        ...req.body,
                        userId : req['tokenId'],
                    })
                    if(order) {
                        res.status(201).json("done");
                    } else {
                        console.log(Error);
                        res.status(404).json("Something wrong")
                    }
                } else {
                    res.status(401).json({tokenId : true})
                console.log(Error);
                }
        } catch(err){
            console.log(err);
            res.status(500).json(err)
        }
    }


    public getUserOrders = async (req: any, res: Response) =>{
        console.log(req['tokenId'])
        try{
            const orders = await orderModel.aggregate([
                {
                    $match : {
                        userId : Types.ObjectId(req['tokenId'])
                    }
                },
                {
                    $lookup : {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind : {
                        path: "$userDetails",
                        preserveNullAndEmptyArrays : true,
                    }
                },
                {
                    $lookup : {
                        from: "categors",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $unwind : {
                        path: "$categoryDetails",
                        preserveNullAndEmptyArrays : true,
                    }
                },
                {
                    project: {
                        productName: "$categoryDetails.productName",
                        firstName : "$userDetails.firstName",
                        lastName: "$userDetails.lastName",
                        email : "$userDetails.email",
                        quantity: "$quantity",
                        shippingAddress1 : "$shippingAddress1",
                        shippingAddress2 : "$shippingAddress2",
                        city: "$city",
                        zip : "$zip",
                        country: "$country",
                        totalPrice: "$totalPrice",
                        status: "$status",
                        phoneNo : "$phoneNo",
                    }
                }
            ])
            if(orders) {
                res.status(200).json(orders);
            } else {
                console.log(Error);
            }
        } catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    }

    // public getUserOrders = async(req: Request, res: Response) =>{
    //     try{
    //         const user = await orderModel.find({userId: req.body.userId});
    //         if(user){
    //             res.status(200).json(user);
    //         } else {
    //             res.status(409).json({user: true})
    //         }
    //     } catch(err){
    //         res.status(500).json(err);
    //     }
    // }

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