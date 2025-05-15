import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "./app.module";
import {INestApplication} from "@nestjs/common";
import { App } from "supertest/types";


describe("Bootstrap", ()=>{
    let app: INestApplication<App>;
    beforeEach( async()=>{
       const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
       }).compile();    
       app = moduleFixture.createNestApplication();
       await app.init()
    })
    afterEach( async ()=>{
        await app?.close()
    })
    it("should start the application without crashing",async ()=>{
        await expect (app.listen(3000)).resolves.not.toThrow();
    })
});

