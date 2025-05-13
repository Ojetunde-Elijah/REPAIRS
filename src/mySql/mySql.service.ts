import {DefaultDatabaseConfig} from "./mySql.default";
import {DatabaseConfig} from "./mySql.interface";

export const DatabaseCredentials: DatabaseConfig = {
    type: "mysql",
    host: process.env.DB_HOST || DefaultDatabaseConfig.host,
    port: parseInt(process.env.DB_PORT|| "") || DefaultDatabaseConfig.port,
    username: process.env.DB_USERNAME || DefaultDatabaseConfig.username,
    password: process.env.DB_PASSWORD || DefaultDatabaseConfig.password,
    database: process.env.DB_DATABASE || DefaultDatabaseConfig.database,
    synchronize: true,
    logging: true,	
    entities: [__dirname + '/../**/*.entity{.ts,.js)'],
    migrations: ["dist/migrations/*.js"],
    cli: {
        migrationsDir: "src/migrations",
    },
};