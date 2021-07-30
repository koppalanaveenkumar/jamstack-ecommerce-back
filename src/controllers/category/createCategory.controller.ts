import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import config from '../../config'
import categoryModel from '../../models/category/category.model';


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
                    const tokenData = this.createToken(categoryNew);
                    res.status(201).json({
                        auth: true,
                        token: tokenData,
                        categoryName: requestBody
                    })
                }
            }
        } catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }
}