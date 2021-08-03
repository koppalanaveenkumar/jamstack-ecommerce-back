import { Router } from "express";
import OrderController from "../../controllers/orders/order.controller";
import userScret from "../../utils/user.verify";

class OrderRouter {
    public router: Router = Router();
    private OrderController: OrderController = new OrderController();

    constructor() {
        this.initializeRoutes();
    };

    private initializeRoutes(){
        this.router.post('/createOrder', userScret,this.OrderController.createOrder);
        this.router.get('/getUserOrders', userScret,this.OrderController.getUserOrders);
        this.router.post('/addCart', this.OrderController.addCart);
        this.router.get('/getUserCart', this.OrderController.getUserCart);
        this.router.delete('/deleteCart', this.OrderController.deleteCartById)
    }
}


export default OrderRouter;