import { Router } from 'express';
import AdminController from '../controllers/admin/admin.controller';
import getScret from '../utils/admin.verify';
class AdminRouter {
    public router: Router = Router();
    private adminController : AdminController = new AdminController();

    constructor(){
        this.initializeRouter();
    }

    private initializeRouter(){
        this.router.post('/addAdmin', this.adminController.createAdmin);
        this.router.post('/authenticate', this.adminController.authenticate);
        this.router.post('/changePassword', getScret,this.adminController.changePassword);
        // customers
        this.router.get('/allUsers', this.adminController.allUsers)
        this.router.get('/getUserById/:userId', this.adminController.getUserById)
    }
}

export default AdminRouter;