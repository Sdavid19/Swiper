import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma';
import * as argon from 'argon2';
import { BadRequestException } from '@nestjs/common';

jest.mock('argon2', () => ({
  hash: jest.fn(),
}));

describe('UserService - createUser', () => {
  let service: UserService;

  const prismaMock = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should throw if email already exists', async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
    });

    await expect(
      service.createUser({
        email: 'test@test.com',
        password: '123456',
        name: 'Test',
      } as any),
    ).rejects.toThrow(BadRequestException);

    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  it('should create user with hashed password', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    (argon.hash as jest.Mock).mockResolvedValue('hashed-password');

    prismaMock.user.create.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
      imageUrl: null,
    });

    const result = await service.createUser({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    } as any);

    expect(argon.hash).toHaveBeenCalledWith('123456');

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@test.com',
        name: 'Test',
        passwordHash: 'hashed-password',
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });

    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
      imageUrl: null,
    });
  });
});