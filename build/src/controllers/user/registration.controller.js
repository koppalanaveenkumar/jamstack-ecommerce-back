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
class UserController {
    constructor() {
        this.createToken = (user) => {
            const expiresIn = 60 * 60;
            const dataStoredToken = {
                _id: user._id,
                time: user["lastLogginIn"],
                isAdmin: true
            };
            return jsonwebtoken_1.sign(dataStoredToken, config_1.default.USER_JWT_SECRET, { expiresIn });
        };
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.secret == "jamstack") {
                try {
                    const email = yield user_model_1.default.findOne({
                        email: req.body.email
                    });
                    if (email) {
                        res.status(409).json({ email: true });
                    }
                    else {
                        const hashPassword = yield bcryptjs_1.default.hashSync(req.body.password, 10);
                        const requestBody = {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            phoneNo: req.body.phoneNo,
                            password: hashPassword,
                            lastLoggedIn: moment_1.default().unix()
                        };
                        const user = yield user_model_1.default.create(requestBody);
                        if (user) {
                            res.status(201).json("Done");
                        }
                    }
                }
                catch (err) {
                    res.status(500).json(err);
                }
            }
            else {
                res.status(409).json({ secret: true });
            }
        });
        this.authenticate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userEmail = yield user_model_1.default.findOne({ email: req.body.email });
                if (userEmail) {
                    const comparePassword = yield bcryptjs_1.default.compareSync(req.body.password, userEmail['password']);
                    if (comparePassword) {
                        const updateTimesstamp = yield user_model_1.default.findOneAndUpdate({ _id: userEmail['_id'] }, { $set: { lastLoggedIn: moment_1.default().unix() } }, { new: true });
                        if (updateTimesstamp) {
                            const tokenData = this.createToken(updateTimesstamp);
                            res.status(200).json({ auth: true, tokenData: tokenData, email: userEmail['email'] });
                        }
                    }
                    else {
                        res.status(409).json({ password: true });
                    }
                }
                else {
                    res.status(409).json({ username: true });
                }
            }
            catch (err) {
                res.status(409).json(err);
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
        // public changePassword = async (req: any, res: Response) => {
        //     try{
        //         const userEmail: any = await userModel.findOne({email: req.body.email});
        //         if(userEmail){
        //             if(bcrypt.compareSync(req.body.currentPassword, userEmail.password)){
        //                 let updateUser = await userModel.updateOne({email: req.body.email}, {$set:{password: bcrypt.hashSync(req.body.newPassword, 10)}}, {new : true});
        //                 if(updateUser){
        //                         res.status(200).json("Password updated Successfully")
        //                 } else {
        //                     res.status(401).json({status: "Failed in update password"})
        //                 }
        //             } else {
        //                 res.status(401).json({currentPassword: true});
        //             }
        //         } else {
        //             res.status(409).json({email: true})
        //         } 
        //     } catch (err){
        //         console.log(err)
        //         res.status(500).json(err);
        //     }
        // }
    }
}
exports.default = UserController;
//# sourceMappingURL=registration.controller.js.map