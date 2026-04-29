import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma';
import { AppModule } from '../../src/app.module';
import { FieldErrorValidationPipe } from '../../src/shared/pipes/field-validation.pipe';
import { SigninDto } from '../../src/auth/dto';
import { UserDto } from '../../src/user/dto';
import { CreateBankDto } from '../../src/question-bank/dto';
import { Category } from '@prisma/client';
import { resetDb } from '../helpers/db-reset';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    let accessToken: string;
    let user: UserDto;
    let category: Category;


    const singInDto = {
        email: `test@example.com`,
        password: 'password',
        name: 'Test User',
    } as SigninDto;

    const logInDto = {
        email: `test@example.com`,
        password: 'password',
    } as SigninDto;

    let createBankDto: CreateBankDto;


    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        require('dotenv').config({ path: '.env.test' });

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new FieldErrorValidationPipe());
        await app.init();

        prisma = moduleFixture.get(PrismaService);
        await resetDb(prisma);

        category = await prisma.category.create({ data: { name: 'Math', color: 'blue', slug: 'math' } })

        await request(app.getHttpServer()).post('/auth/signup').send(singInDto);
        const loginRes = await request(app.getHttpServer()).post('/auth/login').send(logInDto);

        accessToken = loginRes.body.access_token;
        user = loginRes.body.user;

        createBankDto = {
            title: 'title',
            description: 'desc',
            categoryId: +category.id,
            imageUrl: ''
        } as CreateBankDto;

    });

    afterAll(async () => {
        await app.close();
    });

    describe('create bank', () => {
        it('should create question bank', async () => {
            const resp = await request(app.getHttpServer())
                .post('/question-banks/create')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(createBankDto)
                .expect(201);

            expect(resp.body.title).toBe(createBankDto.title);
            expect(resp.body.category.id).toBe(createBankDto.categoryId);
            expect(resp.body.creator.id).toBe(user.id);
        });

        it('should not create question bank without category', async () => {
            const res = await request(app.getHttpServer())
                .post('/question-banks/create')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'title' })
                .expect(400);

            expect(res.body.error).toBe('Field error');
            expect(res.body.message.categoryId).toBeDefined();

        });

        it('should not create question bank without title', async () => {
            const res = await request(app.getHttpServer())
                .post('/question-banks/create')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: '', category: category.id })
                .expect(400);

            expect(res.body.error).toBe('Field error');
            expect(res.body.message.title).toBeDefined();

        });
    })

});