import {DatabaseConfig} from "./mySql.interface";
export const DefaultDatabaseConfig: DatabaseConfig = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "repairs",
    synchronize: true,
    logging: true,	
    entities: [__dirname + '/../**/*.entity{.ts,.js)'],
    migrations: ["dist/migrations/*.js"],
    cli: {
        migrationsDir: "src/migrations",
    },
};