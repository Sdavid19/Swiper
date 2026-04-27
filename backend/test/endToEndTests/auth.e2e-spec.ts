import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma';
import { AppModule } from '../../src/app.module';
import { FieldErrorValidationPipe } from '../../src/shared/pipes/field-validation.pipe';
import { resetDb } from '../helpers/db-reset';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const user = {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Test User',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        require('dotenv').config({ path: '.env.test' });

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new FieldErrorValidationPipe());
        await app.init();

        prisma = moduleFixture.get(PrismaService);
        await resetDb(prisma);
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /auth/signup should create user', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(user)
            .expect(201);

        expect(res.body).toBeDefined();
        expect(res.body.email).toBe(user.email);
    });

    it('POST /auth/signup wrong email should return error', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: "", password: 'password', name: 'asd' })
            .expect(400);

        expect(res.body.error).toBe('Field error');
        expect(res.body.message.email).toBeDefined();
    });

    it('POST /auth/signup wrong username should return error', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: "", password: 'password', name: 'a' })
            .expect(400);

        expect(res.body.error).toBe('Field error');
        expect(res.body.message.name).toBeDefined();
    });

    it('POST /auth/signup wrong password should return error', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: "", password: 'pass', name: 'asd' })
            .expect(400);

        expect(res.body.statusCode).toBe(400);
        expect(res.body.error).toBe('Field error');
        expect(res.body.message.password).toBeDefined();
    });

    it('POST /auth/login should return token + user', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: user.email,
                password: user.password,
            })
            .expect(200);

        expect(res.body.access_token).toBeDefined();
        expect(res.body.user.email).toBe(user.email);
    });

    it('POST /auth/login wrong password should fail', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: user.email,
                password: 'wrong-password',
            })
            .expect(401);
    });


});