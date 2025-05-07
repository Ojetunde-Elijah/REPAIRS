import {Test,TestingModule} from '@nestjs/testing';
import {LoggerMiddleware} from './logger.middleware';
import {Logger} from './logger';
import {Request,Response} from 'express';
import * as moment from 'moment';

let middleware: LoggerMiddleware;
let mockLogger: jest.Mocked<Logger>;
describe("LoggerMiddleware", () => {

    beforeEach(async ()=>{
        mockLogger = {
            http: jest.fn()
        } as unknown as jest.Mocked<Logger>;
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                LoggerMiddleware,
                {
                    provide: Logger,
                    useValue: mockLogger
                }
            ]
        }).compile();
        middleware = module.get<LoggerMiddleware>(LoggerMiddleware);
    })
});
describe("use", () => {
    it("should call next() and log the request and response", ()=>{
        const mockRequest = {
            socket:{remoteAddress:"127.0.0.1"},
            method: "GET",
            originalUrl: "/test",
            httpVersion: "1.1",
            headers: {}
        } as Request;

        const mockResponse = {
            statusCode: 200,
            getHeader: jest.fn().mockReturnValue(100),
            on: jest.fn((event,callback)=>{
                if(event === "close")callback()
            })
        } as unknown as Response;
        const nextFn = jest.fn();

        middleware.use(mockRequest,mockResponse,nextFn);
        expect(nextFn).toHaveBeenCalled();
        expect(mockResponse.on).toHaveBeenCalledWith("close",expect.any(Function));
        expect(mockLogger.http).toHaveBeenCalled()
        

    })
})
describe("getResponseSize", () => {
    it("should return the size of the response", ()=>{
        const mockResponse = {
            getHeader: jest.fn().mockReturnValue(100)
        } as unknown as Response;
        const size = middleware.getResponseSize(mockResponse);
        expect(size).toBe(100);
    });

    it("should return parsed number when COntent-Length is a string", ()=>{
        const mockResponse = {
            getHeader: jest.fn().mockReturnValue("200")
        } as unknown as Response;

        const size = middleware.getResponseSize(mockResponse);
        expect(size).toBe(200);
    })
    it("should return 0 when Content-Length is not a number or string",()=>{
        const mockResponse = {
            getHeader: jest.fn().mockReturnValue(null)
        } as unknown as Response;
    })
    const size = middleware.getResponseSize(mockResponse);
        expect(size).toBe(0)

})
describe("generateLogMessage", () => {
    it("should generate a log message with the correct format", () => {
        const mockRequest = {
            socket: { remoteAddress: '127.0.0.1'},
            method: "GET",
            originalUrl: "/test",
            httpVersion: "1.1",
            headers: {
                referer: "http://example.com",
                "user-agent": "test-agent"
            }
        } as Request;
        const mockResponse = {
            statusCode: 200,
            getHeader: jest.fn().mockReturnValue(100)
        } as unknown as Response;
        const timeTaken = 1000;
        const logMessage = middleware.generateLogMessage(mockRequest, mockResponse,timeTaken);
        const expectedDate = moment().format('DD/MMM/YYYY:HH:mm:ss ZZ');
        expect(logMessage).toContain('127.0.0.1');
        expect(logMessage).toContain('-');
        expect(logMessage).toContain('-');
        expect(logMessage).toContain(`[${expectedDate}]`);
        expect(logMessage).toContain('GET /test 1.1');
        expect(logMessage).toContain('200');
        expect(logMessage).toContain('100');
        expect(logMessage).toContain('http://example.com');
        expect(logMessage).toContain('"test-agent"');
        expect(logMessage).toContain('"%{Referer}i %{User-agent}i"');
        

})

