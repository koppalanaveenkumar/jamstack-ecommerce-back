import { Router } from 'express';
import addCategoryController from '../../controllers/category/addCategory.controller';

class AddCategoryRouter {
    public router: Router = Router();
    private categoryController : addCategoryController = new addCategoryController();

    constructor(){
        this.initializeRouter();
    }

    private initializeRouter(): void{
        this.router.post('/addItem', this.categoryController.addCategoryItem);
        this.router.get('/allItems', this.categoryController.allItems);
    }
}

export default AddCategoryRouter;