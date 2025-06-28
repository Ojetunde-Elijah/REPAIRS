import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    service = new UserService(prisma);
  });

  it('should create user', async () => {
    prisma.user.create.mockResolvedValue({ id: 1 });
    const result = await service.createUser({ id: 1, email: 'a' });
    expect(result).toEqual({ id: 1 });
  });

  it('should update user', async () => {
    prisma.user.update.mockResolvedValue({ id: 1 });
    const result = await service.updateUser({ id: 1, email: 'a' });
    expect(result).toEqual({ id: 1 });
  });

  it('should delete user', async () => {
    prisma.user.delete.mockResolvedValue({ id: 1 });
    const result = await service.deleteUser(1);
    expect(result).toEqual({ id: 1 });
  });

  it('should find user by email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a' });
    const result = await service.findByEmail('a');
    expect(result).toEqual({ id: 1, email: 'a' });
  });
}); 