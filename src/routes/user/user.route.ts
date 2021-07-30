import { Router } from "express";
import UserController from "../../controllers/user/registration.controller";    
import userScret from '../../utils/user.verify';

class UserRouter {
    public router: Router = Router();
    private userController : UserController = new UserController();

    constructor(){
        this.initializeRouter();
    }

    private initializeRouter(){
        this.router.post('/addUser', this.userController.addUser);
        this.router.post('/authenticate', this.userController.authenticate);
        this.router.post('/changePassword', userScret,this.userController.changePassword);
    }  
}

export default UserRouter;