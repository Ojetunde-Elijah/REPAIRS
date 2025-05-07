export interface ConfigData{
    env: string;
    port: number;
    mongo?: undefined;
    logLevel: string;
    redisUri: string;
    redisToken: string;
    FirebasePrivateKey: string;
    FirebaseClientEmail: string;
    FirebaseProjectId: string;
}