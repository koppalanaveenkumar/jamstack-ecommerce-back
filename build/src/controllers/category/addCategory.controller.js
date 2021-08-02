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
class addCategoryController {
    constructor() {
        this.createToken = (category) => {
            const expiresIn = 60 * 60;
            const dataStoredInToken = {
                _id: category._id,
                time: category["lastLoggedIn"],
                isAdmin: true
            };
            return jsonwebtoken_1.sign(dataStoredInToken, config_1.default.ADMIN_JWT_SECRET, { expiresIn });
        };
        this.addCategoryItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let categoryId = yield category_model_1.default.findById(req.body["categoryId"]);
                if (categoryId) {
                    let product = new addCategory_model_1.default(req.body);
                    const products = yield product.save();
                    if (products) {
                        res.status(201).json("done");
                    }
                    else {
                        res.status(409).json({ Error: "Something went wrong" });
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
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
}
exports.default = addCategoryController;
//# sourceMappingURL=addCategory.controller.js.map