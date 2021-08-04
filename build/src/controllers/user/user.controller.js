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
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = __importDefault(require("../../models/user/user.model"));
const moment_1 = __importDefault(require("moment"));
const common_service_1 = require("../../services/common.service");
const emailSender_service_1 = require("../../services/emailSender.service");
class UserController {
    constructor() {
        this.createToken = (user) => {
            const expiresIn = 60 * 60;
            const dataStoredToken = {
                _id: user._id,
                time: user["lastLogginIn"]
            };
            return jsonwebtoken_1.sign(dataStoredToken, config_1.default.USER_JWT_SECRET, { expiresIn });
        };
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = yield user_model_1.default.findOne({ email: req.body.email });
                if (email) {
                    res.status(406).json({ email: true });
                }
                else {
                    const phoneNo = yield user_model_1.default.findOne({ phoneNo: req.body.phoneNo });
                    if (phoneNo) {
                        res.status(406).json({ phoneNo: true });
                    }
                    else {
                        const hashPassword = yield bcryptjs_1.default.hashSync(req.body.password, 10);
                        const requestBody = Object.assign(Object.assign({}, req.body), { password: hashPassword, lastLoggedIn: moment_1.default().unix(), lastUpdatedAt: Date.now() });
                        const user = yield user_model_1.default.create(requestBody);
                        if (user) {
                            res.status(201).json("Done");
                        }
                    }
                }
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
        this.authenticate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ $or: [{ email: req.body.email }, { phoneNo: req.body.phoneNo }] });
                if (user) {
                    const comparePassword = yield bcryptjs_1.default.compareSync(req.body.password, user['password']);
                    if (comparePassword) {
                        const updateTimesstamp = yield user_model_1.default.findOneAndUpdate({ _id: user["_id"] }, { $set: { lastLoggedIn: moment_1.default().unix() } }, { new: true });
                        if (updateTimesstamp) {
                            const tokenData = this.createToken(updateTimesstamp);
                            res.status(200).json({
                                auth: true,
                                token: tokenData,
                                email: user["email"],
                                user: user["firstName"] + " " + user["lastName"],
                                isUser: user["isUser"],
                                isActive: user["isActive"]
                            });
                        }
                    }
                    else {
                        res.status(409).json({ password: true });
                        console.log(Error);
                    }
                }
                else {
                    res.status(409).json({ userEmail: true });
                    console.log(Error);
                }
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById(req['tokenId']);
                if (user) {
                    if (bcryptjs_1.default.compareSync(req.body.currentPassword, user.password)) {
                        let updateUser = yield user_model_1.default.updateOne({ _id: req['tokenId'] }, { $set: { password: bcryptjs_1.default.hashSync(req.body.newPassword, 10) } }, { new: true });
                        if (updateUser) {
                            res.status(200).json("Password updated Successfully");
                        }
                        else {
                            res.status(401).json({ status: "Failed in update password" });
                        }
                    }
                    else {
                        res.status(401).json({ currentPassword: true });
                    }
                }
                else {
                    res.status(409).json({ username: true });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.sendEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ email: req.body.email });
                if (user) {
                    const token = yield common_service_1.commonService.generateRandomBytes();
                    const updateUser = yield user_model_1.default.findByIdAndUpdate({ _id: user["_id"] }, {
                        resetPasswordToken: token,
                        resetPasswordExpires: Date.now() + 86400000,
                    }, { upsert: true, new: true });
                    if (updateUser) {
                        updateUser.type = "resetPassword";
                        yield emailSender_service_1.emailSenderService.sendEmail(updateUser, token);
                        res.status(200).json({ status: 1, data: { message: "Sent Successfully" } });
                    }
                    else {
                        res.status(200).json({ status: 0, data: { message: "Failed in sending email, Try again" } });
                    }
                }
                else {
                    res.status(200).json({ status: 0, data: { message: "Email not found" } });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).send(err);
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({
                    resetPasswordToken: req.body.token,
                    resetPasswordExpires: { $gt: Date.now() }
                });
                if (user) {
                    const hashedPassword = yield bcryptjs_1.default.hashSync(req.body.newPassword, 10);
                    if (hashedPassword) {
                        const updatedUser = yield user_model_1.default.findByIdAndUpdate({ _id: user["_id"] }, {
                            $set: {
                                password: hashedPassword,
                                resetPasswordToken: undefined,
                                resetPasswordExpires: undefined,
                            },
                        }, { upsert: true, new: true });
                        if (updatedUser) {
                            res.status(200).json({
                                status: 1, data: { message: "Password updated successfully" }
                            });
                        }
                    }
                }
                else {
                    console.log(Error);
                    res.status(200).json({
                        status: 0,
                        data: {
                            errorDescription: "Password reset token is invalid or has expired.",
                            error: "expired_token",
                        }
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map