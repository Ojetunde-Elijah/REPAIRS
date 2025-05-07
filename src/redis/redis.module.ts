import { Module } from "@nestjs/common";
import { RedisModule } from "@nestjs-modules/ioredis";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                try{
                    const config = configService.getConfig();
                    if(!config?.redisToken){
                        throw new Error("Redis db connection crash")
                    }
                return {
                    type: 'single',
                    url: `rediss://default:${encodeURIComponent(config.redisToken)}@excited-perch-22844.upstash.io:6379`,
                    options: {
                        tls: {}, // Required for Upstash
                        connectTimeout: 10000, // 10 seconds
                    }
                };
                }catch(error){
                    console.error("Error in RedisModule:", error);
                    return {
                        type: 'single',
                        url: '',
                        options: {
                            connectTimeout: 10000,
                        }
                    };

                }
            },
            inject: [ConfigService]
        }),
    ],
    exports: [RedisModule]
})
export class RedisConfigModule {}