import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import config from '../../config'
import categoryModel from '../../models/category/category.model';
import addCategoryItemModel from '../../models/category/addCategory.model'

export default class addCategoryController {
    public createToken = (category: any) =>{
        const expiresIn = 60 * 60
        const dataStoredInToken = {
            _id: category._id,
            time: category["lastLoggedIn"],
            isAdmin: true
        };
        return sign(dataStoredInToken, config.ADMIN_JWT_SECRET, {expiresIn});
    }

    public addCategoryItem = async(req: any, res: Response) =>{
        let product = new addCategoryItemModel(req.body);
        try{
            const products = await product.save();
            if(products){
                res.status(201).json("done")
            }
            else {
                res.status(409).json({Error: "Something went wrong"})
            }
        } catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }


    public allItems = async(req: Request, res: Response) =>{
        try{
            const allItems = await addCategoryItemModel.find({});
            if(allItems) {
                res.status(200).json(allItems)
            }
            else{
                res.status(409).json({allItems: true});
            }
        } catch(err){
            res.status(500).json(err);
        }
    }
}