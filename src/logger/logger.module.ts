import {Module,Global, NestModule, MiddlewareConsumer} from "@nestjs/common"
import {Logger} from "./logger"
import {ConfigModule} from "../config/config.module"
import {LoggerMiddleware} from "./logger.middleware"
@Global()
@Module({
    imports: [ConfigModule],
    providers: [Logger],
    exports: [Logger]
})
export class LoggerModule implements NestModule{
    public configure(consumer: MiddlewareConsumer){
        consumer
        .apply(LoggerMiddleware)
        .forRoutes()
    }
} 