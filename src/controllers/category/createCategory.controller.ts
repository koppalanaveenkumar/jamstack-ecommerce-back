import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import config from '../../config'
import categoryModel from '../../models/category/category.model';
import addCategoryModel from '../../models/category/addCategory.model'


export default class CategoryController {
    public createToken = (category: any) =>{
        const expiresIn = '60 seconds'
        const dataStoredInToken = {
            _id: category._id,
            time: category["lastLoggedIn"],
            isAdmin: true
        };
        return sign(dataStoredInToken, config.ADMIN_JWT_SECRET, {expiresIn});
    }

    public createCategory = async(req: Request, res: Response) =>{
        try{
            const category = await categoryModel.findOne({
                categoryName : req.body.categoryName
            });
            if(category){
                res.status(409).json( {categoryName: true} )
            } else{
                const requestBody = {
                    categoryName : req.body.categoryName
                } 
                const categoryNew = await categoryModel.create(requestBody);
                if(categoryNew) {
                    res.status(201).json("Done")
                }
                else {
                    res.status(404).json({message : "Something went wrong"})
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
        } catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }

    public addCategoryItem = async(req: any, res: Response) =>{
        try{
            let categoryId = await categoryModel.findById(req.body["categoryId"])
            if(categoryId){
                let product = await addCategoryModel.findOne({productName:req.body.productName});
                if(product){
                    res.status(404).send({productName: true})
                } else {
                    let product = new addCategoryModel(req.body);
                        const products = await product.save();
                        if(products){
                            res.status(201).json("done")
                        }
                        else {
                            res.status(409).json({Error: "Something went wrong"})
                        }
                }
            } else {
                res.status(404).send({categoryId: "Not Found"})
            }
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
        
    }

    public allItems = async(req: Request, res: Response) =>{
        try{
            const category = await categoryModel.findById(req.params.categoryId)
            console.log(category)
            if(category){
                const allItems = await addCategoryModel.aggregate([
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
                ])
                if(allItems) {
                    res.status(200).json(allItems)
                    console.log(allItems)
                }
                else{
                    res.status(409).json({allItems: true});
                }
            } else {
                console.log(Error);
                res.status(404).json({category: true});
            }
        } catch(err){
            res.status(500).json(err);
        }
    }
}