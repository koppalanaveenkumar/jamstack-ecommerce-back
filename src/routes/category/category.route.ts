import { Router } from 'express';
import CategoryController from '../../controllers/category/createCategory.controller';

class CategoryRouter {
    public router: Router = Router();
    private CategoryController : CategoryController = new CategoryController();

    constructor(){
        this.initializeRouter();
    }

    private initializeRouter(): void{
        this.router.post('/addCategory', this.CategoryController.createCategory);

    }
}

export default CategoryRouter;