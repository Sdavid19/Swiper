import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma';
import { AppModule } from '../../src/app.module';
import { FieldErrorValidationPipe } from '../../src/shared/pipes/field-validation.pipe';

describe('QuestionBank (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const signupAndLogin = async (email: string) => {
    const password = 'Password123!';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password,
        name: 'Test User',
      });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    return {
      token: res.body.access_token,
      user: res.body.user,
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    process.env.NODE_ENV = 'test';

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new FieldErrorValidationPipe());

    await app.init();

    prisma = moduleFixture.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.questionBank.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create question bank', async () => {
    const email = `test-${Date.now()}@test.com`;

    const { token, user } = await signupAndLogin(email);

    const category = await prisma.category.create({
      data: {
        name: 'Math',
        color: 'blue',
        slug: 'math',
      },
    });

    const dto = {
      title: 'title',
      description: 'desc',
      categoryId: category.id,
      imageUrl: '',
    };

    const res = await request(app.getHttpServer())
      .post('/question-banks/create')
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(201);

    expect(res.body.title).toBe(dto.title);
    expect(res.body.category.id).toBe(category.id);
    expect(res.body.creator.id).toBe(user.id);
  });

  it('should not create without categoryId', async () => {
    const email = `test-${Date.now()}@test.com`;

    const { token } = await signupAndLogin(email);

    const res = await request(app.getHttpServer())
      .post('/question-banks/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'title' })
      .expect(400);

    expect(res.body.message.categoryId).toBeDefined();
  });

  it('should not create without title', async () => {
    const email = `test-${Date.now()}@test.com`;

    const { token } = await signupAndLogin(email);

    const category = await prisma.category.create({
      data: {
        name: 'Math',
        color: 'blue',
        slug: 'math',
      },
    });

    const res = await request(app.getHttpServer())
      .post('/question-banks/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ categoryId: category.id, title: '' })
      .expect(400);

    expect(res.body.message.title).toBeDefined();
  });
});