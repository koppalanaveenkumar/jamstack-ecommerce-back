"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../models/user/user.model"));
const order_model_1 = __importDefault(require("../../models/order/order.model"));
const userCart_model_1 = __importDefault(require("../../models/order/userCart.model"));
const jsonwebtoken_1 = require("jsonwebtoken");
// import { Promise } from "mongoose";
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = require("mongoose");
class OrderController {
    constructor() {
        this.createToken = (order) => {
            const expiresIn = 60 * 60;
            const dataStoreInToken = {
                _id: order._id,
                time: order['lastLoggedIn'],
                isAdmin: true
            };
            return jsonwebtoken_1.sign(dataStoreInToken, config_1.default.USER_JWT_SECRET, { expiresIn });
        };
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield user_model_1.default.findById(req["tokenId"], { password: 0, });
                if (userDetails) {
                    const order = yield order_model_1.default.create(Object.assign(Object.assign({}, req.body), { userId: req['tokenId'] }));
                    if (order) {
                        res.status(201).json("done");
                    }
                    else {
                        console.log(Error);
                        res.status(404).json("Something wrong");
                    }
                }
                else {
                    res.status(401).json({ tokenId: true });
                    console.log(Error);
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.getUserOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req['tokenId']);
            try {
                const orders = yield order_model_1.default.aggregate([
                    {
                        $match: {
                            userId: mongoose_1.Types.ObjectId(req['tokenId'])
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $unwind: {
                            path: "$userDetails",
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        $lookup: {
                            from: "categors",
                            localField: "categoryId",
                            foreignField: "_id",
                            as: "categoryDetails"
                        }
                    },
                    {
                        $unwind: {
                            path: "$categoryDetails",
                            preserveNullAndEmptyArrays: true,
                        }
                    },
                    {
                        project: {
                            productName: "$categoryDetails.productName",
                            firstName: "$userDetails.firstName",
                            lastName: "$userDetails.lastName",
                            email: "$userDetails.email",
                            quantity: "$quantity",
                            shippingAddress1: "$shippingAddress1",
                            shippingAddress2: "$shippingAddress2",
                            city: "$city",
                            zip: "$zip",
                            country: "$country",
                            totalPrice: "$totalPrice",
                            status: "$status",
                            phoneNo: "$phoneNo",
                        }
                    }
                ]);
                if (orders) {
                    res.status(200).json(orders);
                }
                else {
                    console.log(Error);
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });
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
        this.addCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let orders = new userCart_model_1.default(req.body);
            try {
                let order = yield orders.save();
                if (order) {
                    res.status(201).json('done');
                }
                else {
                    res.status(404).json({ message: "Something went wrong" });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.getUserCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userCart_model_1.default.find({ userId: req.body.userId });
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(409).json({ user: true });
                }
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
        this.deleteCartById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cartId = yield userCart_model_1.default.findByIdAndDelete({ _id: req.body._id });
                if (cartId) {
                    res.status(200).json({ status: "delete" });
                }
                else {
                    res.status(409).json({ cartId: true });
                }
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
}
exports.default = OrderController;
//# sourceMappingURL=order.controller.js.map