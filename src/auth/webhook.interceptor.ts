import {Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException} from "@nestjs/common";

import {Observable} from "rxjs";
import { Request } from "express";
import { createHmac } from "crypto";

@Injectable()
export class WebhookInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>()
        const sig = request.headers["x-supabase-signature"]
        const secret = process.env.SUPABASE_WEBHOOK_SECRET;

        if(!sig || !secret){
            throw new UnauthorizedException("Missing signature or secret for webhook verification");
        }

        const hmac = createHmac("sha256", secret);
        const digest = hmac.update(JSON.stringify(request.body)).digest("hex");

        if(sig !== digest){
            throw new UnauthorizedException("Invalid signature for webhook verification");  
        }

        return next.handle()
    }
}