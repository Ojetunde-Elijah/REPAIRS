import {Catch,ExceptionFilter,ArgumentsHost,HttpException, HttpStatus} from "@nestjs/common";        
import { Http } from "winston/lib/winston/transports";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = 
        exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR 
        
        const errorResponse = {
            code: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message:
            status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? (exception as any)["message"]["error"] || (exception as any)["message"]
            : "Internal server error",
        };

        response.status(status).json(errorResponse);
    }
}