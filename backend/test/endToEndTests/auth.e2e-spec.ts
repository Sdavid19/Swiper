import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma';
import { AppModule } from '../../src/app.module';
import { FieldErrorValidationPipe } from '../../src/shared/pipes/field-validation.pipe';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const createUser = () => ({
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    password: 'Password123!',
    name: 'Test User',
  });

  const signup = (user: any) =>
    request(app.getHttpServer()).post('/auth/signup').send(user);

  const login = (email: string, password: string) =>
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({imports: [AppModule],}).compile();

    process.env.NODE_ENV = 'test';

    app = testModule.createNestApplication();
    app.useGlobalPipes(new FieldErrorValidationPipe());

    await app.init();

    prisma = testModule.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create user', async () => {
    const user = createUser();

    const res = await signup(user).expect(201);

    expect(res.body.email).toBe(user.email);
  });

  it('should return error for invalid email', async () => {
    const res = await signup({
      email: '',
      password: 'password',
      name: 'asd',
    }).expect(400);

    expect(res.body.error).toBe('Field error');
    expect(res.body.message.email).toBeDefined();
  });

  it('should return error for invalid username', async () => {
    const res = await signup({
      email: 'test@test.com',
      password: 'password',
      name: 'a',
    }).expect(400);

    expect(res.body.error).toBe('Field error');
    expect(res.body.message.name).toBeDefined();
  });

  it('should return error for weak password', async () => {
    const res = await signup({
      email: 'test@test.com',
      password: 'pass',
      name: 'asd',
    }).expect(400);

    expect(res.body.error).toBe('Field error');
    expect(res.body.message.password).toBeDefined();
  });

  it('should login and return token, user', async () => {
    const user = createUser();

    await signup(user).expect(201);

    const res = await login(user.email, user.password).expect(200);

    expect(res.body.access_token).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
  });

  it('should fail login with wrong password', async () => {
    const user = createUser();

    await signup(user).expect(201);

    await login(user.email, 'wrong-password').expect(401);
  });
});