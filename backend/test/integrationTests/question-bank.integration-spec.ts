import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../src/prisma";
import { QuestionBankService } from "../../src/question-bank/services/question-bank.service";
import { AppModule } from "../../src/app.module";
import { resetDb } from "../helpers/db-reset";
import { BankState } from "../../src/question-bank/dto";
import { Category, Media, QuestionBankTemplate, User } from "@prisma/client";
import { QuestionService } from "../../src/question/services/question.service";

describe('QuestionBank integration test', () => {
    let testMOdule: TestingModule;
    let prisma: PrismaService;
    let bankService: QuestionBankService;
    let questionService: QuestionService

    let testUser: User;
    let categoryMath: Category;
    let categoryPhysics: Category;
    let template: QuestionBankTemplate;

    let movie1: Media;
    let movie2: Media;
    let series1: Media;

    beforeAll(async () => {
        testMOdule = await Test.createTestingModule({imports: [AppModule]}).compile();

        prisma = testMOdule.get(PrismaService);
        bankService = testMOdule.get(QuestionBankService);
        questionService = testMOdule.get(QuestionService);
    });

    beforeEach(async () => {
        await resetDb(prisma);

        testUser = await prisma.user.create({
            data: { email: 'test@test.com', passwordHash: 'hashed-password', name: 'Test User' },
        });

        categoryMath = await prisma.category.create({ data: { name: 'Math', slug: 'math' } });
        categoryPhysics = await prisma.category.create({ data: { name: 'Physics', slug: 'physics' } });
    });

    afterAll(async () => {
        await testMOdule.close();
    });

    describe('create bank', () => {

        it('should create a question bank', async () => {
            const dto = {
                categoryId: categoryPhysics.id,
                creatorId: testUser.id,
                title: "Test title",
                description: "Test description",
            };

            const created = await bankService.create(dto, testUser.id);
            expect(created.title).toBe(dto.title);

            const dbRecord = await prisma.questionBank.findUnique({ where: { id: created.id } });
            expect(dbRecord).toBeDefined();
        });
    })

    describe('findAll', () => {
        beforeEach(async () => {
            await prisma.questionBank.createMany({
                data: [
                    { title: 'Algebra', creatorId: testUser.id, categoryId: categoryMath.id, description: '' },
                    { title: 'Calculus', creatorId: testUser.id, categoryId: categoryMath.id, description: '' },
                    { title: 'Mechanics', creatorId: testUser.id, categoryId: categoryPhysics.id, description: '' },
                ]
            });
        });

        it('should return paginated list of banks', async () => {
            const result = await bankService.findAll(testUser.id, BankState.ALL, undefined, undefined, 1, 1);

            expect(result.banks).toHaveLength(1);
            expect(result.hasMore).toBe(true);
        });

        it('should filter by category', async () => {
            const result = await bankService.findAll(testUser.id, BankState.ALL, undefined, [categoryPhysics.id]);

            expect(result.banks).toHaveLength(1);
        });

        it('should filter by text search', async () => {
            const result = await bankService.findAll(testUser.id, BankState.ALL, 'Algebra');
            expect(result.banks).toHaveLength(1);
            expect(result.banks[0].title).toBe('Algebra');
        });
    });

    describe('createMediaQuestinBankByTemplate test', () => {
        beforeEach(async () => {
            template = await prisma.questionBankTemplate.create({
                data: {
                    title: 'Template title',
                    description: 'Template description',
                    categoryId: categoryMath.id,
                }
            });

            await prisma.platform.createMany({ data: [{ name: "netflix" }, { name: "hbo" }] })

            movie1 = await prisma.media.create({ data: { name: 'Movie1', imdbId: 'customId1', mediaType: "MOVIE" } })
            series1 = await prisma.media.create({ data: { name: 'Series1', imdbId: 'customId2', mediaType: "SERIES" } })
            movie2 = await prisma.media.create({ data: { name: 'Movie2', imdbId: 'customId3', mediaType: "MOVIE" } })

            await prisma.mediaPlatform.createMany({
                data: [
                    { mediaId: movie1.id, platformName: 'hbo' },
                    { mediaId: series1.id, platformName: 'netflix' },
                    { mediaId: movie2.id, platformName: 'netflix' }
                ]
            })
        });


        it('should create banks by templates with questions', async () => {
            const result = await bankService.createMediaQuestionBankByTemplate(
                ['hbo'],
                template.id,
                testUser.id,
                "MOVIE",
            );

            const questions = await questionService.findAllQuestionsByBankId(result.id);

            expect(result).toBeDefined();
            expect(result.title).toBe(template.title);
            expect(result.description).toBe(template.description);
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBe(1);
            expect(questions[0].text).toBe(movie1.name);
        });
    });
});