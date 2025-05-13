export interface DatabaseConfig{
    type: "mysql";
    host: string
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    entities: string[];
    migrations?: string[];
    cli?: {
        migrationsDir: string;
    }
    
}