import { SupabaseAuthGuard } from './supabase-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

jest.mock('axios');
jest.mock('jsonwebtoken');

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;
  let context: any;

  beforeEach(() => {
    guard = new SupabaseAuthGuard();
    context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer valid.token.here' } }),
      }),
    };
  });

  it('should throw if no token', async () => {
    context.switchToHttp = () => ({ getRequest: () => ({ headers: {} }) });
    await expect(guard.canActivate(context as any)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if token is invalid', async () => {
    (jwt.decode as any).mockReturnValue(null);
    await expect(guard.canActivate(context as any)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if key not found', async () => {
    (jwt.decode as any).mockReturnValue({ header: { kid: 'abc' } });
    (axios.get as any).mockResolvedValue({ data: { keys: [] } });
    await expect(guard.canActivate(context as any)).rejects.toThrow(UnauthorizedException);
  });

  it('should attach user if token is valid', async () => {
    (jwt.decode as any).mockReturnValue({ header: { kid: 'abc' } });
    (axios.get as any).mockResolvedValue({ data: { keys: [{ kid: 'abc', x5c: ['cert'] }] } });
    (jwt.verify as any).mockReturnValue({ email: 'test@example.com' });
    const req = { headers: { authorization: 'Bearer valid.token.here' } };
    context.switchToHttp = () => ({ getRequest: () => req });
    const result = await guard.canActivate(context as any);
    expect(result).toBe(true);
    expect(req.user).toEqual({ email: 'test@example.com' });
  });
}); 