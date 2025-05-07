import {Module, DynamicModule} from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';


import { DbConnectionError, DbError } from './db.error';
import { MongooseModuleOptions,MongooseModule } from '@nestjs/mongoose';

@Module({})
export class DatabaseModule{
    public static getNoSqlConnectionOptions(config:ConfigService):MongooseModuleOptions{
        const dbdata = config.getConfig().mongo;

        if(!dbdata){
            throw new DbConnectionError("Database config is missing")
        }
        return {
            uri: dbdata
        }
    }
    public static forRoot(): DynamicModule{
        return{
            module: DatabaseModule,
            imports: [
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory:(configService: ConfigService)=> DatabaseModule.getNoSqlConnectionOptions(configService),
                    inject: [ConfigService]
                })
            ],
            controllers: [],
            providers: [],
            exports: []
        }
    }
}