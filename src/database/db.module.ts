import {Module, DynamicModule} from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import {Logger} from "./../logger/logger"


import { DbConnectionError, DbError } from './db.error';
import { MongooseModuleOptions,MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from '../logger/logger.module';

@Module({})
export class DatabaseModule{
    public static getNoSqlConnectionOptions(config:ConfigService,logger:Logger):MongooseModuleOptions{
        
        const dbdata = config.getConfig().MONGO_DB_URI;
        console.log(dbdata)
        if(!dbdata){
            throw new DbConnectionError("Database config is missing")
        }
        return {
            uri: dbdata,
            connectionFactory: (connection)=>{
                connection.on("connected",()=>{
                    logger.log("MongoDb connected successfully")
                    console.log("MongoDb connected successfully")
                })
                connection.on("disconnected",()=>{
                    logger.warn("MongoDB connection error")
                    console.log("Mongodb disconnected")
                })
                connection.on("error",()=>{
                    logger.error("MOngoDB connection error")
                    console.log("MongoDb error")
                })
                return connection
            }   
        }
    }

    public static forRoot(): DynamicModule{
        return{
            module: DatabaseModule,
            imports: [
                MongooseModule.forRootAsync({
                    imports: [ConfigModule,LoggerModule],
                    useFactory:(configService: ConfigService, logger:Logger)=> DatabaseModule.getNoSqlConnectionOptions(configService,logger),
                    inject: [ConfigService,Logger]
                })
            ],
            controllers: [],
            providers: [],
            exports: [MongooseModule]
        }
    }
}
