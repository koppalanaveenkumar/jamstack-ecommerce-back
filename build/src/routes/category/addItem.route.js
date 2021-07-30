"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addCategory_controller_1 = __importDefault(require("../../controllers/category/addCategory.controller"));
class AddCategoryRouter {
    constructor() {
        this.router = express_1.Router();
        this.categoryController = new addCategory_controller_1.default();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/addItem', this.categoryController.addCategoryItem);
        this.router.get('/allItems', this.categoryController.allItems);
    }
}
exports.default = AddCategoryRouter;
//# sourceMappingURL=addItem.route.js.map