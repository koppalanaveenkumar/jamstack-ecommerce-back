"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = __importDefault(require("../../controllers/user/registration.controller"));
const user_verify_1 = __importDefault(require("../../utils/user.verify"));
class UserRouter {
    constructor() {
        this.router = express_1.Router();
        this.userController = new registration_controller_1.default();
        this.initializeRouter();
    }
    initializeRouter() {
        this.router.post('/addUser', this.userController.addUser);
        this.router.post('/authenticate', this.userController.authenticate);
        this.router.post('/changePassword', user_verify_1.default, this.userController.changePassword);
    }
}
exports.default = UserRouter;
//# sourceMappingURL=user.route.js.map