import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: any;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: UserService, useValue: userService },
      ],
    }).overrideGuard(SupabaseAuthGuard).useValue({ canActivate: () => true }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should return user if exists', async () => {
    const req = { user: { email: 'test@example.com' } };
    userService.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });
    const result = await controller.getMe(req as any);
    expect(result.user).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should create user if not exists', async () => {
    const req = { user: { email: 'new@example.com' } };
    userService.findByEmail.mockResolvedValue(null);
    userService.createUser.mockResolvedValue({ id: 2, email: 'new@example.com' });
    const result = await controller.getMe(req as any);
    expect(result.user).toEqual({ id: 2, email: 'new@example.com' });
  });
}); 