import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto, SignupDto } from './dto';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
    },
  };

  const mockUserService = {
    findUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
          {
            provide: UserService,
            useValue: mockUserService,
          },
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
        ],
      }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should signup user', async () => {
    (argon.hash as jest.Mock).mockResolvedValue(
      'hashed',
    );

    mockUserService.findUserByEmail.mockResolvedValue(
      null,
    );

    mockPrisma.user.create.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      name: 'Test',
      imageUrl: null,
    });

    const result = await service.signup({
      email: 'test@test.com',
      name: 'Test',
      password: '1234',
    } as SignupDto);

    expect(result.email).toBe('test@test.com');
    expect(
      mockPrisma.user.create,
    ).toHaveBeenCalled();
  });

  it('should throw if email exists', async () => {
    mockUserService.findUserByEmail.mockResolvedValue(
      { id: 1 },
    );

    await expect(
      service.signup({
        email: 'test@test.com',
        name: 'Test',
        password: '1234',
      } as SignupDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should signin user and return token', async () => {
    mockUserService.findUserByEmail.mockResolvedValue(
      {
        id: 1,
        email: 'test@test.com',
        name: 'Test',
        passwordHash: 'hashed',
        imageUrl: null,
      },
    );

    (argon.verify as jest.Mock).mockResolvedValue(
      true,
    );
    mockJwtService.signAsync.mockResolvedValue(
      'token123',
    );

    const result = await service.signin({
      email: 'test@test.com',
      password: '1234',
    } as SigninDto);

    expect(result.access_token).toBe('token123');
    expect(
      mockJwtService.signAsync,
    ).toHaveBeenCalled();
  });

  it('should throw if user not found', async () => {
    mockUserService.findUserByEmail.mockResolvedValue(
      null,
    );

    await expect(
      service.signin({
        email: 'x',
        password: 'y',
      } as SigninDto),
    ).rejects.toThrow(UnauthorizedException);
  });
});
