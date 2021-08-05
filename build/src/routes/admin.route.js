"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin/admin.controller"));
const admin_verify_1 = __importDefault(require("../utils/admin.verify"));
class AdminRouter {
    constructor() {
        this.router = express_1.Router();
        this.adminController = new admin_controller_1.default();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/addAdmin', this.adminController.createAdmin);
        this.router.post('/authenticate', this.adminController.authenticate);
        this.router.post('/changePassword', admin_verify_1.default, this.adminController.changePassword);
        this.router.post('/adminCheck', admin_verify_1.default, this.adminController.adminCheck);
        // customers
        this.router.get('/allUsers', this.adminController.allUsers);
        this.router.get('/getUserById/:userId', this.adminController.getUserById);
    }
}
exports.default = AdminRouter;
//# sourceMappingURL=admin.route.js.map