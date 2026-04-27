import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../src/prisma";
import { VoteService } from "../../src/vote/services/vote.service";
import { Category, Question, QuestionBank, User, Vote } from "@prisma/client";
import { AppModule } from "../../src/app.module";
import { resetDb } from "../helpers/db-reset";

describe('Vote Integration', () => {
    let module: TestingModule;
    let prisma: PrismaService;
    let voteService: VoteService;

    let testUser1: User;
    let testUser2: User;
    let bank1: QuestionBank;
    let bank2: QuestionBank;
    let categoryMath: Category;
    let vote1: Vote;
    let vote2: Vote;
    let question1: Question;
    let question2: Question;


    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        prisma = module.get(PrismaService);
        voteService = module.get(VoteService);
    });

    beforeEach(async () => {
        await resetDb(prisma);

        testUser1 = await prisma.user.create({
            data: { email: 'test1@test.com', passwordHash: 'hashed-password', name: 'Test User1' },
        });

        testUser2 = await prisma.user.create({
            data: { email: 'test2@test.com', passwordHash: 'hashed-password', name: 'Test User2' },
        });

        categoryMath = await prisma.category.create({ data: { name: 'Math', slug: 'math' } });

        bank1 = await prisma.questionBank.create({
            data: { title: 'Title1', description: 'desc', creatorId: testUser1.id, categoryId: categoryMath.id }
        });

        question1 = await prisma.question.create({
            data: { text: 'Text1', description: 'desc', bankId: bank1.id }
        });

        bank2 = await prisma.questionBank.create({
            data: { title: 'Title2', description: 'desc', creatorId: testUser2.id, categoryId: categoryMath.id }
        });

        question2 = await prisma.question.create({
            data: { text: 'Text2', description: 'desc', bankId: bank2.id }
        });
    });

    afterAll(async () => {
        await module.close();
    });

    describe('get votes user participated in', () => {
        beforeEach(async () => {
            vote1 = await prisma.vote.create({
                data: { title: 'test vote 1', startsAt: new Date(2025, 6, 5), endsAt: new Date(2025, 6, 5), bankId: bank1.id, creatorId: testUser1.id }
            });
            vote2 = await prisma.vote.create({
                data: { title: 'test vote 2', startsAt: new Date(), endsAt: new Date(), bankId: bank2.id, creatorId: testUser2.id }
            });

            await prisma.answer.createMany({
                data: [
                    { answer: true, questionId: question1.id, voteId: vote1.id, userId: testUser1.id },
                    { answer: true, questionId: question2.id, voteId: vote2.id, userId: testUser2.id },
                    { answer: true, questionId: question2.id, voteId: vote2.id, userId: testUser1.id }
                ]
            });

        });

        it('should return list of votes user participated inonly', async () => {
            const result = await voteService.findAllVotesUserParticipatedIn(testUser2.id, undefined, undefined, 1, 10, []);

            expect(result).toBeDefined();
            expect(result.votes.length).toBe(1);
            expect(result.votes[0].id).toBe(vote2.id);
            expect(result.votes[0].title).toBe(vote2.title);
        });

        it('pagination should work', async () => {
            const result = await voteService.findAllVotesUserParticipatedIn(testUser1.id, undefined, undefined, 1, 1, []);

            expect(result).toBeDefined();
            expect(result.votes.length).toBe(1);
            expect(result.hasMore).toBe(true);
        });

        it('should return list of votes by date', async () => {
            const result = await voteService.findAllVotesUserParticipatedIn(testUser1.id, new Date(2025, 6, 5), undefined, 1, 10, []);

            expect(result).toBeDefined();
            expect(result.votes.length).toBe(1);
            expect(result.votes[0].id).toBe(vote1.id);
            expect(result.votes[0].title).toBe(vote1.title);
        });
    });

    describe('get stat from vote', () => {
        beforeEach(async () => {
            vote1 = await prisma.vote.create({
                data: { title: 'test vote', startsAt: new Date(2025, 6, 5), endsAt: new Date(2025, 6, 5), bankId: bank1.id, creatorId: testUser1.id }
            });

            await prisma.answer.createMany({
                data: [
                    { answer: true, questionId: question1.id, voteId: vote1.id, userId: testUser1.id },
                    { answer: false, questionId: question1.id, voteId: vote1.id, userId: testUser2.id }
                ]
            });
        });

        it('should return votes correctly', async () => {
            const stat = await voteService.getStats(vote1.id, testUser1.id);

            expect(stat.userCount).toBe(2)
            expect(stat.stats.length).toBe(1)
            expect(stat.stats[0].yes).toBe(1)
            expect(stat.stats[0].no).toBe(1)
            expect(stat.stats[0].answers.some(x => x.user.id == testUser1.id)).toBe(true);
            expect(stat.stats[0].answers.some(x => x.user.id == testUser2.id)).toBe(true);
        })
    })
});