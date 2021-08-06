import { Router } from 'express';
import CategoryController from '../../controllers/category/categorys.controller';
import getScret from '../../utils/admin.verify';

class CategoryRouter {
    public router: Router = Router();
    private CategoryController : CategoryController = new CategoryController();

    constructor(){
        this.initializeRouter();
    }

    private initializeRouter(): void{
        this.router.post('/addCategory', getScret,this.CategoryController.createCategory);
        this.router.get('/allCategory', this.CategoryController.allCategory);

        //products
        this.router.post('/addProduct', getScret,this.CategoryController.addProduct);
        this.router.get('/categoryProducts/:_id', this.CategoryController.categoryProducts);
    }
}

export default CategoryRouter;