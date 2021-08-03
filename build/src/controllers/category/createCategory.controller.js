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
const config_1 = __importDefault(require("../../config"));
const category_model_1 = __importDefault(require("../../models/category/category.model"));
const addCategory_model_1 = __importDefault(require("../../models/category/addCategory.model"));
class CategoryController {
    constructor() {
        this.createToken = (category) => {
            const expiresIn = '60 seconds';
            const dataStoredInToken = {
                _id: category._id,
                time: category["lastLoggedIn"],
                isAdmin: true
            };
            return jsonwebtoken_1.sign(dataStoredInToken, config_1.default.ADMIN_JWT_SECRET, { expiresIn });
        };
        this.createCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_model_1.default.findOne({
                    categoryName: req.body.categoryName
                });
                if (category) {
                    res.status(409).json({ categoryName: true });
                }
                else {
                    const requestBody = {
                        categoryName: req.body.categoryName
                    };
                    const categoryNew = yield category_model_1.default.create(requestBody);
                    if (categoryNew) {
                        res.status(201).json("Done");
                    }
                    else {
                        res.status(404).json({ message: "Something went wrong" });
                    }
                    // if(categoryNew) {
                    //     const tokenData = this.createToken(categoryNew);
                    //     res.status(201).json({
                    //         auth: true,
                    //         token: tokenData,
                    //         categoryName: requestBody
                    //     })
                    // }
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.addCategoryItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let categoryId = yield category_model_1.default.findById(req.body["categoryId"]);
                if (categoryId) {
                    let product = yield addCategory_model_1.default.findOne({ productName: req.body.productName });
                    if (product) {
                        res.status(404).send({ productName: true });
                    }
                    else {
                        let product = new addCategory_model_1.default(req.body);
                        const products = yield product.save();
                        if (products) {
                            res.status(201).json("done");
                        }
                        else {
                            res.status(409).json({ Error: "Something went wrong" });
                        }
                    }
                }
                else {
                    res.status(404).send({ categoryId: "Not Found" });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        });
        this.allItems = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_model_1.default.findById(req.params.categoryId);
                console.log(category);
                if (category) {
                    const allItems = yield addCategory_model_1.default.aggregate([
                        {
                            $lookup: {
                                from: "categories",
                                localField: "categoryId",
                                foreignField: "_id",
                                as: "categoryDetails"
                            }
                        },
                        {
                            $unwind: {
                                path: "$categoryDetails",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $project: {
                                title: "$productName",
                                description: "$description",
                                brand: "$brand",
                                color: "$color",
                                price: "$price",
                                countInStock: "$countInStock",
                                categoryName: "$categoryDetails.categoryName"
                            }
                        }
                    ]);
                    if (allItems) {
                        res.status(200).json(allItems);
                        console.log(allItems);
                    }
                    else {
                        res.status(409).json({ allItems: true });
                    }
                }
                else {
                    console.log(Error);
                    res.status(404).json({ category: true });
                }
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
}
exports.default = CategoryController;
//# sourceMappingURL=createCategory.controller.js.map