import { verify, decode } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import adminModel from '../models/admin/admin.model';


const getScret = async (req: any, res: Response, next: NextFunction) => {
    console.log(req.headers)
    const reqToken: any = req.headers && req.headers.authorization || '';
    const token = reqToken.split(' ');
    try{
        if(token && token.length  === 2) {
            const matchToken = token[1];
            const verified = verify(matchToken, config.ADMIN_JWT_SECRET);
            if(verified) {
                if(token){
                    const decoded: any = decode(matchToken);
                    console.log(decoded)
                    if(decoded){

                            const adminDetails : any = await adminModel.findById(decoded._id);
                            if(adminDetails){
                                req['tokenId'] = decoded._id;
                                next();
                            } else{
                                res.status(401).json({token: true})
                                console.log(Error)
                            }
                    }
                    else {
                        console.log({err : "decoded"});
                    }
                } else {
                    res.status(409).json({token: true});
                    console.log({err : "token"});
                }
            } else {
                res.status(401).json({verified: true})
            }        
        }else {
            res.status(401).json({token: true})
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

export default getScret;