import { verify, decode } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import userModel from '../models/user/user.model';


const userScret = async (req: any, res: Response, next: NextFunction) => {
    console.log(req.headers)
    const reqToken: any = req.headers && req.headers.authorization || '';
    const token = reqToken.split(' ');
    try{
        if(token && token.length  === 2) {
            const matchToken = token[1];
            const verified = verify(matchToken, config.USER_JWT_SECRET);
            if(verified) {
                if(token){
                    const decoded: any = decode(matchToken);
                    console.log(decoded)
                    if(decoded){
                        try{
                            const adminDetails : any = await userModel.findById(decoded._id);
                            if(adminDetails){
                                req['tokenId'] = decoded._id;
                                next();
                            } else{
                                res.status(401).json({token: true})
                            }
                        } catch(err) {
                            console.log(err);
                        }
                    }
                    else {
                        console.log({err : "decoded"});
                    }
                } else {
                    console.log({err : "token"});
                }
            } else {
                res.status(401).json({verified: true})
            }        
        }else {
            res.status(401).json({token: true})
        }
    } catch(err){
            console.log(err);
            res.status(500).json(err);
    }
}

export default userScret;