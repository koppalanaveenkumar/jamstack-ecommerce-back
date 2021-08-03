"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorys_controller_1 = __importDefault(require("../../controllers/category/categorys.controller"));
const admin_verify_1 = __importDefault(require("../../utils/admin.verify"));
class CategoryRouter {
    constructor() {
        this.router = express_1.Router();
        this.CategoryController = new categorys_controller_1.default();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/addCategory', admin_verify_1.default, this.CategoryController.createCategory);
        this.router.post('/addProduct', admin_verify_1.default, this.CategoryController.addProduct);
        this.router.get('/categoryProducts/:_id', this.CategoryController.categoryProducts);
    }
}
exports.default = CategoryRouter;
//# sourceMappingURL=category.route.js.map