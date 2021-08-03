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
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const config_1 = __importDefault(require("./config"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const category_route_1 = __importDefault(require("./routes/category/category.route"));
// import AddCategoryRouter from './routes/category/addItem.route'
const user_route_1 = __importDefault(require("./routes/user/user.route"));
const order_route_1 = __importDefault(require("./routes/orders/order.route"));
const formData = require('express-form-data');
class App {
    constructor(port) {
        this.app = express_1.default();
        this.adminRouter = new admin_route_1.default();
        this.categoryRouter = new category_route_1.default();
        // private addCategoryRouter: AddCategoryRouter = new AddCategoryRouter();
        this.OrderRouter = new order_route_1.default();
        this.UserRouter = new user_route_1.default();
        this.config = () => {
            this.app.use(cors_1.default());
            this.bodyParserConfig();
            this.app.use((req, res, next) => {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', '0');
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-type, Accept');
                next();
            });
            this.mongooseConfig();
            this.initializeRoutes();
        };
        this.bodyParserConfig = () => {
            this.app.use(body_parser_1.urlencoded({ extended: false }));
            this.app.use(body_parser_1.json({ limit: '19MB' }));
            this.app.use(formData.parse());
        };
        this.mongooseConfig = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.connect(config_1.default.MONGO_URL, {
                    useNewUrlParser: true
                });
                console.log("Connected to DB");
            }
            catch (error) {
                console.log(`mongoErr : : ${error}`);
            }
        });
        this.initializeRoutes = () => {
            this.app.use('/admin', this.adminRouter.router);
            this.app.use('/category', this.categoryRouter.router);
            // this.app.use('/addCategory', this.categoryRouter.router)
            this.app.use('/order', this.OrderRouter.router);
            this.app.use('/user', this.UserRouter.router);
            // Swagger Documentation
            this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
        };
        this.listen = () => {
            this.app.listen(this.port, () => {
                console.log(`Server started on the port ${this.port}`);
            });
        };
        this.port = port;
        this.config();
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map