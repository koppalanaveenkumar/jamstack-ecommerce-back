"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../../controllers/orders/order.controller"));
const user_verify_1 = __importDefault(require("../../utils/user.verify"));
class OrderRouter {
    constructor() {
        this.router = express_1.Router();
        this.OrderController = new order_controller_1.default();
        this.initializeRoutes();
    }
    ;
    initializeRoutes() {
        this.router.post('/createOrder', user_verify_1.default, this.OrderController.createOrder);
        this.router.get('/getUserOrders', user_verify_1.default, this.OrderController.getUserOrders);
        this.router.post('/addCart', this.OrderController.addCart);
        this.router.get('/getUserCart', this.OrderController.getUserCart);
        this.router.delete('/deleteCart', this.OrderController.deleteCartById);
    }
}
exports.default = OrderRouter;
//# sourceMappingURL=order.route.js.map