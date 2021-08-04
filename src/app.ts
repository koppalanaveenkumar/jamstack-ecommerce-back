import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import config from './config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json'
import AdminRouter from './routes/admin.route';
import CategoryRouter from './routes/category/category.route';
// import AddCategoryRouter from './routes/category/addItem.route'
import UserRouter from './routes/user/user.route'
import OrderRouter from './routes/orders/order.route'
const formData = require('express-form-data');

export default class App{
    public app: express.Application = express();
    public port: number;
    private adminRouter: AdminRouter = new AdminRouter();
    private categoryRouter: CategoryRouter = new CategoryRouter();
    // private addCategoryRouter: AddCategoryRouter = new AddCategoryRouter();
    private OrderRouter: OrderRouter = new OrderRouter();
    private UserRouter: UserRouter = new UserRouter();
    client: any;
    categoryAddItemRouter: any;
    constructor(port: number){
        this.port = port;
        this.config();
    }

    private config = () =>{
        this.app.use(cors());
        this.bodyParserConfig();
        this.app.use((req, res, next)=>{
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Pragma', 'no-cache');
            res.header('Expires', '0');
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-type, Accept');
            next();
        });
        this.mongooseConfig();
        this.initializeRoutes();
    }

    private bodyParserConfig= () =>{
        this.app.use(urlencoded({ extended: false }));
        this.app.use(json({ limit: '19MB'}));
        this.app.use(formData.parse());
    }

    private mongooseConfig = async () =>{
        try{
            await connect(config.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
            console.log("Connected to DB");
        } catch (error){
            console.log(`mongoErr : : ${error}`)
        }
    }

    private initializeRoutes = () =>{
        this.app.use('/admin', this.adminRouter.router)
        this.app.use('/category', this.categoryRouter.router)
        // this.app.use('/addCategory', this.categoryRouter.router)
        this.app.use('/order', this.OrderRouter.router)
        this.app.use('/user', this.UserRouter.router)

        
        // Swagger Documentation
        this.app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));
    }

    public listen = () =>{
        this.app.listen(this.port, ()=>{
            console.log(`Server started on the port ${this.port}`)
        })
    }
}
