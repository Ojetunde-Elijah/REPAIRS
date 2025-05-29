import {Request,Response} from "express";
import {Test,TestingModule} from "@nestjs/testing";
import {Logger} from "./logger";

import * as moment "moment";
import { LoggerMiddleware } from "./logger.middleware";
import { UsingJoinTableIsNotAllowedError } from "typeorm";

let middleware: LoggerMiddleware
let mockLogger: jest.Mocked<Logger>

describe("Logger Middleware", ()=>{
    beforeEach(async()=>{
        mockLogger = {
            http: jest.fn()
        } as unknown as jest.Mocked<Logger>
    })
    const module = Test.createTestingModule({
        providers: [
            LoggerMiddleware,
            {
                provide: Logger,
                useValue:mockLogger
            }

        ]
    }).compile()
    middleware = module.get<LoggerMiddleware>(LoggerMiddleware)
})
describe("use",()=>{
    it("should call next and also request and response",()=>{
        const mockRequest = {
            socket: {remoteAddress: "127.0.0:1"},
            method:"GET",
            originalUrl:"/test",
            httpVersion: "1.0",
            header:{}
        } as Request

        const mockResponse
    })
})