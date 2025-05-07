import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { FirebaseAuthService } from "src/services/firebase.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly firebaseService: FirebaseAuthService){}
    public async use(req: Request, res:Response, next: NextFunction){
        try {
            const {authorization} = req.headers;
            if(!authorization){
                throw new HttpException({message: "missing authorization header"}, HttpStatus.BAD_REQUEST)
            }
            const user = await this.firebaseService.authenticate(authorization)
            console.log(user);
            req.user = user;
            next()
        } catch (error) {
            throw new HttpException({message: "Invalid token"},HttpStatus.BAD_REQUEST)
        }
    }
}