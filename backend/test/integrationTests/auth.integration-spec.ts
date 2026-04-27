import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { resetDb } from '../helpers/db-reset';

describe('AuthModule – Integration Test', () => {
  let module: TestingModule;
  let authService: AuthService;
  let prisma: PrismaService;

  const user = {
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
    name: 'Test User',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    authService = module.get(AuthService);
    prisma = module.get(PrismaService);

    await resetDb(prisma);
  });

  afterAll(async () => {
    await module.close();
  });

  it('signup() should create a user', async () => {
    const result = await authService.signup(user);

    expect(result).toBeDefined();
    expect(result.email).toBe(user.email);

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    expect(dbUser).toBeDefined();
  });

  it('login() should return a token', async () => {
    const result = await authService.signin({
      email: user.email,
      password: user.password,
    });

    expect(result).toBeDefined();
    expect(result.access_token).toBeDefined();
  });

  it('login() should throw on wrong password', async () => {
    await expect(
      authService.signin({
        email: user.email,
        password: 'wrongpassword',
      }),
    ).rejects.toThrow();
  });
});
