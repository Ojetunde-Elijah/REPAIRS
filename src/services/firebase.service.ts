import {Injectable,UnauthorizedException} from "@nestjs/common"
import admin from ".././main"
import { Logger } from "src/logger/logger"
import { ApiUnauthorizedResponse } from "@nestjs/swagger";


@Injectable()
export class FirebaseAuthService{
    constructor(private logger: Logger){}

    private getToken(authToken: string): string{
        const match = authToken.match(/^Bearer (.*)$/);
            if(!match || match.length < 2){
                this.logger.error("Invalid token format")
                throw new UnauthorizedException("Invalid token format")
            }
            return match[1]
    }
    public async authenticate(authToken:string):Promise<any>{
        const tokenString = this.getToken(authToken);
        try {
            const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(tokenString)
            this.logger.info(`${JSON.stringify(decodedToken)}`)
            console.log(decodedToken);
            const {
                email,
                uid,
                role
            }   = decodedToken  

            return {email,uid,role}
        } catch (err) {
            this.logger.error(`error while authenticating user ${err}`)
            throw new UnauthorizedException(err.message)
        }
    }
}
