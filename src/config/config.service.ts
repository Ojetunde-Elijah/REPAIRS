import {Injectable} from "@nestjs/common";

import {DEFAULT_CONFIG} from "./config.default";
import {ConfigData} from "./config.interface";

@Injectable()
export class ConfigService{
    private config: ConfigData

    constructor(data: ConfigData = DEFAULT_CONFIG){
        this.config = data;
    }

    public loadingUsingDotEnv(){
        this.config = this.parseConfigFromEnv(process.env);
    }

    private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData{
        return {
            env: env.NODE_ENV || DEFAULT_CONFIG.env,
            port: parseInt(env.PORT || "") || DEFAULT_CONFIG.port,
            mongo: undefined,
            logLevel: env.LOG_LEVEL || DEFAULT_CONFIG.logLevel,
            redisUri: env.REDIS_URI || DEFAULT_CONFIG.redisUri,
            redisToken: env.REDIS_TOKEN || DEFAULT_CONFIG.redisToken,
            FirebasePrivateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || DEFAULT_CONFIG.FirebasePrivateKey,
            FirebaseClientEmail: env.FIREBASE_CLIENT_EMAIL || DEFAULT_CONFIG.FirebaseClientEmail,
            FirebaseProjectId: env.FIREBASE_PROJECT_ID || DEFAULT_CONFIG.FirebaseProjectId,
            MONGO_DB_URI: env.MONGO_DB_URI || DEFAULT_CONFIG.MONGO_DB_URI
        
        }
    }

    public getConfig(): ConfigData{
        return this.config;
    }
}