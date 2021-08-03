"use strict";
// import { Request, Response, NextFunction } from 'express';
// import { sign } from 'jsonwebtoken';
// import config from '../../config'
// import categoryModel from '../../models/category/category.model';
// import addCategoryItemModel from '../../models/category/addCategory.model'
// export default class addCategoryController {
//     public createToken = (category: any) =>{
//         const expiresIn = 60 * 60
//         const dataStoredInToken = {
//             _id: category._id,
//             time: category["lastLoggedIn"],
//             isAdmin: true
//         };
//         return sign(dataStoredInToken, config.ADMIN_JWT_SECRET, {expiresIn});
//     }
//     public addCategoryItem = async(req: any, res: Response) =>{
//         try{
//             let categoryId = await categoryModel.findById(req.body["categoryId"])
//             if(categoryId){
//                 let product = new addCategoryItemModel(req.body);
//                     const products = await product.save();
//                     if(products){
//                         res.status(201).json("done")
//                     }
//                     else {
//                         res.status(409).json({Error: "Something went wrong"})
//                     }
//             } else {
//                 res.status(404).send({categoryId: "Not Found"})
//             }
//     } catch(err){
//         console.log(err);
//         res.status(500).json(err);
//     }
//     }
//     public allItems = async(req: Request, res: Response) =>{
//         try{
//             const allItems = await addCategoryItemModel.aggregate([
//                 {
//                     $lookup: {
//                         from: "categories",
//                         localField: "categoryId",
//                         foreignField: "_id",
//                         as: "categoryDetails"
//                     }
//                 },
//                 {
//                     $unwind: {
//                         path: "$categoryDetails",
//                         preserveNullAndEmptyArrays: true
//                     }
//                 },
//                 {
//                     $project: {
//                         title: "$productName",
//                         description: "$description",
//                         brand: "$brand",
//                         color: "$color",
//                         price: "$price",
//                         countInStock: "$countInStock",
//                         categoryName: "$categoryDetails.categoryName"
//                     }
//                 }
//             ])
//             if(allItems) {
//                 res.status(200).json(allItems)
//                 console.log(allItems)
//             }
//             else{
//                 res.status(409).json({allItems: true});
//             }
//         } catch(err){
//             res.status(500).json(err);
//         }
//     }
// }
//# sourceMappingURL=category.controller.js.map