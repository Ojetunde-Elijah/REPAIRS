import { WebhookInterceptor } from './webhook.interceptor';
import { ExecutionContext, UnauthorizedException, CallHandler } from '@nestjs/common';

describe('WebhookInterceptor', () => {
  let interceptor: WebhookInterceptor;
  let context: any;
  let next: CallHandler;

  beforeEach(() => {
    interceptor = new WebhookInterceptor();
    next = { handle: jest.fn() };
  });

  it('should throw if signature or secret missing', () => {
    context = {
      switchToHttp: () => ({ getRequest: () => ({ headers: {}, body: {} }) }),
    };
    process.env.SUPABASE_WEBHOOK_SECRET = undefined;
    expect(() => interceptor.intercept(context as any, next)).toThrow(UnauthorizedException);
  });

  it('should throw if signature is invalid', () => {
    context = {
      switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-supabase-signature': 'bad' }, body: { foo: 'bar' } }) }),
    };
    process.env.SUPABASE_WEBHOOK_SECRET = 'secret';
    expect(() => interceptor.intercept(context as any, next)).toThrow(UnauthorizedException);
  });

  it('should call next.handle if signature is valid', () => {
    const crypto = require('crypto');
    const body = { foo: 'bar' };
    const secret = 'secret';
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(body)).digest('hex');
    context = {
      switchToHttp: () => ({ getRequest: () => ({ headers: { 'x-supabase-signature': digest }, body }) }),
    };
    process.env.SUPABASE_WEBHOOK_SECRET = secret;
    next.handle.mockReturnValue('ok');
    expect(interceptor.intercept(context as any, next)).toBe('ok');
  });
}); 