import {Injectable, CanActivate,ExecutionContext} from "@nestjs/common"
import { RateLimiterService } from "src/services/rate.limiter"
import { Reflector } from "@nestjs/core"
import { Observable } from "rxjs"

@Injectable()
export class RateLimiterGuard implements CanActivate{
    constructor(private readonly rateLimiterService: RateLimiterService,private readonly reflector: Reflector){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const ctx = context.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()

        const {maxTokens = 10, refillRate = 1} = this.reflector.get<{maxTokens:number;refillRate: number}>("rateLimitConfig",context.getHandler()) || {}

        const identifier = request.user?.id || request.ip
        const key = `rate-limit:${identifier}`;

        const allowed = await this.rateLimiterService.consume(key,maxTokens,refillRate);

        if(!allowed){
            response.status(429).json({statusCode: 429, message: `Too many Requests`});
            return false
        }
        return true
    }
}