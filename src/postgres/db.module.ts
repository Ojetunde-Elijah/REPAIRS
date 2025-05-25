import {DynamicModule, Module} from "@nestjs/common";
import {TypeOrmModule,TypeOrmModuleOptions} from "@nestjs/typeorm"

import { DbConfigError } from "./db.error";
import { DbConfig } from "./db.interface";
@Module({})
export class DbModule {
    private static getConnectionOptions (dbconfig: DbConfig): TypeOrmModuleOptions{
        const connectionOptions = DbModule.getConnectionOptionsPostgres();
        return {
            ...connectionOptions,
            entities: dbconfig.entities,
            synchronize: dbconfig.synchronize || false,
            logging: dbconfig.logging || false,
            ssl: !!dbconfig.ssl,
        }
    }

    private static getConnectionOptionsPostgres(): TypeOrmModuleOptions{
       if(!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME){
        throw new DbConfigError(" environment variable is not set")
       }
        return{
            type: "postgres",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            extra: {
                ssl: { rejectUnauthorized: false },
                family: 6, // Force IPv4
              }, 
            // Removed keepConnectionAlive as it is not a valid property
        }
    }

    public static forRoot(dbconfig: DbConfig):DynamicModule{
        return{
            module: DbModule,
            imports:[
                TypeOrmModule.forRootAsync({
                    imports: [],
                    useFactory: ()=> DbModule.getConnectionOptions(dbconfig),
                    inject: [],
                }),
            ],
            controllers: [],
            providers: [],
            exports: [TypeOrmModule]
        }
    }
}