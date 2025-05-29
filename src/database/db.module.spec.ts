// Add Jest types for TypeScript
// / <reference types="jest" />

import {Test} from "@nestjs/testing";
import {DatabaseModule} from "./db.module";
import {ConfigService} from "../config/config.service";
import { Logger } from "../logger/logger";
import { DbConnectionError } from "./db.error";
import { ConfigModule } from "../config/config.module";
import { MongooseModule } from "@nestjs/mongoose";
let configService: jest.Mocked<ConfigService>;
let logger: jest.Mocked<Logger>;


describe('DatabaseModule',() => {
    // Add your tests here
    beforeEach(async ()=>{
        configService = {
                getConfig : jest.fn()
        } as any
        logger = {
                log: jest.fn(),
                warn: jest.fn(),
                error: jest.fn()
        } as any

        
    })
    describe("getNoSqlConnectionOptions",()=>{
        it("should return connection options with valid config", ()=>{
                configService.getConfig.mockReturnValue({
                        env: "development",
                        port:3000,
                        logLevel: "safe",
                        redisUri: "redisuri",
                        redisToken: "redisToken",
                        FirebasePrivateKey: "FirebasePrivateKey",
                        FirebaseClientEmail: "FirebaseClientEmail",
                        FirebaseProjectId: "FirebaseProjectId",
                        MONGO_DB_URI: "mongodb://localhost/test"
                });

                const options = DatabaseModule.getNoSqlConnectionOptions(configService,logger);

                expect(options.uri).toBe("mongodb://localhost/test");
                expect(options.connectionFactory).toBeDefined();
                expect(typeof options.connectionFactory).toBe("function");
        })
        it("should throw an error when the MONGO_DB_URI is undefined",()=>{
                configService.getConfig.mockReturnValue({
                        env: "development",
                        port:3000,
                        logLevel: "safe",
                        redisUri: "redisuri",
                        redisToken: "redisToken",
                        FirebasePrivateKey: "FirebasePrivateKey",
                        FirebaseClientEmail: "FirebaseClientEmail",
                        FirebaseProjectId: "FirebaseProjectId",
                })

                const getOptions = () => DatabaseModule.getNoSqlConnectionOptions(configService,logger);
                expect(getOptions).toThrow(DbConnectionError)
                expect(getOptions).toThrow("Database config is missing");
        })
        it("should attach event listeners", () => {
                const mockConnection = {
                        on: jest.fn(),
                        name: "test-connection"
                }
                const options = DatabaseModule.getNoSqlConnectionOptions( new ConfigService, logger);
                if (!options?.connectionFactory) {
                     throw new Error('connectionFactory is missing from options');
                }
                options.connectionFactory(mockConnection, mockConnection.name);

                expect(mockConnection.on).toHaveBeenCalledTimes(3);
                expect(mockConnection.on).toHaveBeenCalledWith("connected", expect.any(Function));
                expect(mockConnection.on).toHaveBeenCalledWith("disconnected", expect.any(Function));
                expect(mockConnection.on).toHaveBeenCalledWith("error", expect.any(Function));
            });
        });
    });

describe("forRoot", ()=>{
    it("should return a dynamic module with mongoose import", ()=>{
        const module = DatabaseModule.forRoot();

        expect(module).toBeDefined();
        expect(module.module).toBe(DatabaseModule);
        expect(module.imports).toBeDefined();
        expect(module.imports?.length).toBe(1);

    })
    it("should properly configure async MongooseModule", async ()=>{
        const moduleRef = await Test.createTestingModule({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: Logger) =>
        DatabaseModule.getNoSqlConnectionOptions(configService, logger),
      inject: [ConfigService, Logger]
    })
  ],
  providers: [
    { provide: ConfigService, useValue: configService },
    { provide: Logger, useValue: logger }
  ]
}).compile();
        // configService = moduleRef.get<ConfigService>(ConfigService)
        configService.getConfig.mockReturnValue({
             env: "development",
                        port:3000,
                        logLevel: "safe",
                        redisUri: "redisuri",
                        redisToken: "redisToken",
                        FirebasePrivateKey: "FirebasePrivateKey",
                        FirebaseClientEmail: "FirebaseClientEmail",
                        FirebaseProjectId: "FirebaseProjectId",
            MONGO_DB_URI: "mongodb://localhost/test"
        })

        const app = moduleRef.createNestApplication();
        await app.init()

        expect(logger.log).toHaveBeenCalledWith("MongoDb connected successfully")

        await app.close()
    })
})