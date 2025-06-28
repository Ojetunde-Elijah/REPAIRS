import { HttpExceptionFilter } from './exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let host: any;
  let response: any;
  let request: any;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    request = { url: '/test', method: 'GET' };
    host = {
      switchToHttp: () => ({ getResponse: () => response, getRequest: () => request }),
    };
  });

  it('should format HttpException', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(exception, host as any);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ code: HttpStatus.FORBIDDEN, path: '/test', method: 'GET' }));
  });

  it('should format generic error', () => {
    const exception = new Error('fail');
    filter.catch(exception, host as any);
    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ code: HttpStatus.INTERNAL_SERVER_ERROR, path: '/test', method: 'GET' }));
  });
}); 