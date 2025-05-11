import {ConfigData} from "./config.interface";

export const DEFAULT_CONFIG: ConfigData = {
    env: "",
    port: 3000,
    mongo: undefined,
    logLevel: "info",
    redisUri:'https://excited-perch-22844.upstash.io',
    redisToken: 'AVk8AAIjcDEwZGFkOTliYzU2Zjg0YzI2YmNiMjkxNjIxNGI4NWEwNHAxMA',
    // redisPassword:"AVk8AAIjcDEwZGFkOTliYzU2Zjg0YzI2YmNiMjkxNjIxNGI4NWEwNHAxMA",
    FirebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
    FirebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    FirebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
    MONGO_DB_URI: process.env.MONGO_DB_URI || ""
}   