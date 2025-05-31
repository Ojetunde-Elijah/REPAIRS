import {Test, TestingModule} from "@nestjs/testing";
import {ConfigModule} from "./config.module";
import {ConfigService} from "./config.service";

    let configModule: TestingModule
    let configService: ConfigService;
describe("ConfigModule", ()=>{
    

    beforeEach(async()=>{
        configModule = await Test.createTestingModule({
            imports: [ConfigModule]
        }).compile()

        configService = configModule.get<ConfigService>(ConfigService)

    })
    afterEach(async()=>{
        await configModule.close()
    })

    it("should provide ConfigService",()=>{
        expect(configService).toBeDefined()
        expect(configService).toBeInstanceOf(ConfigService)

    })
    it("should export ConfigService", async()=>{
        const importedModule = await Test.createTestingModule({
            imports: [ConfigModule]
        }).compile()

        const exportedService = importedModule.get<ConfigService>(ConfigService)
        
        expect(exportedService).toBeDefined()

    })

    it("should load environment variables",()=>{
        expect(()=>{configService.loadingUsingDotEnv()}).not.toThrow();

    })
})