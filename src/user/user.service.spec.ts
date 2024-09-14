import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return without password', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      // Mock bcrypt 的 hash 函数
      (hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Mock PrismaService 的 user.create 方法

      const prismaCreateSpy = jest
        .spyOn(prismaService.user, 'create')
        // @ts-ignore
        .mockResolvedValue({
          id: 'uuid',
          email,
          createdAt: new Date(),
          // updatedAt: new Date(),
          // roleId: null,
        });

      const result = await service.register(email, password);

      // 断言密码已经加密
      expect(hash).toHaveBeenCalledWith(password, 10);
      // 断言 Prisma create 方法被调用
      expect(prismaCreateSpy).toHaveBeenCalledWith({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      // 断言返回的用户对象不包含 password 字段
      expect(result).toEqual({
        id: 'uuid',
        email,
        createdAt: expect.any(Date),
      });
    });
  });
});
