"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createCategory_controller_1 = __importDefault(require("../../controllers/category/createCategory.controller"));
class CategoryRouter {
    constructor() {
        this.router = express_1.Router();
        this.CategoryController = new createCategory_controller_1.default();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/addCategory', this.CategoryController.createCategory);
    }
}
exports.default = CategoryRouter;
//# sourceMappingURL=category.route.js.map