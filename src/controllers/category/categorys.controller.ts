import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import config from '../../config'
import categoryModel from '../../models/category/category.model';
import productModel from '../../models/category/product.model'
import { Types } from 'mongoose';
import adminModel from '../../models/admin/admin.model';


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

    public createCategory = async(req: any, res: Response) =>{
        try{
            const user: any = await adminModel.findById(req['tokenId']);
            if(user){
                const category = await categoryModel.findOne({categoryName : req.body.categoryName});
                if(!category){
                    const categoryNew = await categoryModel.create(req.body);
                    if(categoryNew) {
                        res.status(201).json("Done")
                    }
                    else {
                        res.status(404).json({message : "Something went wrong"})
                    }
                } else{
                    res.status(404).json( {categoryName: true})
                }
            } else {
                res.status(404).json({tokenId : true})
                console.log(Error);
            }
        } catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }

    public allCategory = async(req: any, res: Response) =>{
        try{
            const category = await categoryModel.find({});
            if(category){
                res.status(200).json(category)
                console.log(category);
            } else {
                res.status(404).json({category: true})
            }
        } catch(err){
            res.status(500).json(err);
        }
    }
    public addProduct = async(req: any, res: Response) =>{
        try{
            const user: any = await adminModel.findById(req['tokenId']);
            if(user){
                let categoryId = await categoryModel.findById(req.body["categoryId"])
                if(categoryId){
                    let product = await productModel.findOne({productName:req.body.productName});
                    if(product){
                        res.status(404).send({productName: true})
                    } else {
                        let product = new productModel(req.body);
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
            } else {
                res.status(404).json({tokenId : true})
                console.log(Error);
            }
        } catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    }

    public categoryProducts = async(req: Request, res: Response) =>{
        try{
            const categoryProducts: any = await productModel.find({categoryId:req.params._id})
                .select(`productName 
                        description 
                        brand 
                        color 
                        price 
                        images 
                        countInStock 
                        manufacture
                `)
            if(categoryProducts){
                res.status(200).json(categoryProducts);
                console.log(categoryProducts)
            } else {
                res.status(404).json({categoryId: true});
            }
        }catch(err){
            res.status(500).json(err);
        }
    }
}