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
        this.router.post('/addItem', this.CategoryController.addCategoryItem);
        this.router.get('/allItemsByCategory/:categoryId', this.CategoryController.allItems);

    }
}

export default CategoryRouter;