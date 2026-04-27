import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../src/prisma";
import { AppModule } from "../../src/app.module";
import { RoomService } from "../../src/vote/services/room.service";
import { resetDb } from "../helpers/db-reset";
import { Category, QuestionBank, User } from "@prisma/client";

describe('RoomService Integration', () => {
    let module: TestingModule;
    let prisma: PrismaService;
    let roomService: RoomService;

    let testUser1: User;
    let testUser2: User;
    let categoryMath: Category;
    let bank: QuestionBank;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        prisma = module.get(PrismaService);
        roomService = module.get(RoomService);
    });

    beforeEach(async () => {
        await resetDb(prisma);

        testUser1 = await prisma.user.create({
            data: { email: 'room1@test.com', passwordHash: 'hash', name: 'Room Tester 1' },
        });

        testUser2 = await prisma.user.create({
            data: { email: 'room2@test.com', passwordHash: 'hash', name: 'Room Tester 2' },
        });


        categoryMath = await prisma.category.create({ data: { name: 'Math', slug: 'math' } });

        bank = await prisma.questionBank.create({
            data: {
                title: 'Math Bank',
                description: 'desc',
                creatorId: testUser1.id,
                categoryId: categoryMath.id
            }
        });
        await prisma.question.createMany({
            data: [
                { text: 'Q1', bankId: bank.id },
                { text: 'Q2', bankId: bank.id },
            ]
        });
    });

    afterAll(async () => {
        await module.close();
    });

    it('should manage the full room lifecycle and save votes to DB', async () => {
        const roomId = await roomService.createRoom(bank.id, testUser1.id);
        expect(roomId).toBeDefined();
        expect(typeof roomId).toBe('number');
        roomService.addUser(roomId, testUser1.id);
        roomService.setUserReady(roomId, testUser1.id, true);

        expect(roomService.isEveryoneReady(roomId)).toBe(true);

        const questions = await prisma.question.findMany({ where: { bankId: bank.id } });

        await roomService.vote(roomId, testUser1.id, questions[0].id, true);

        expect(roomService.isEveryoneVoted(roomId)).toBe(false);

        await roomService.vote(roomId, testUser1.id, questions[1].id, false);
        
        const dbVotes = await prisma.vote.findMany({
            where: { creatorId: testUser1.id },
            include: { answers: true }
        });

        expect(dbVotes).toHaveLength(1);
        expect(dbVotes[0].answers).toHaveLength(2);

    });

    it('should correctly remove user in lobby', async () => {
        const roomId = await roomService.createRoom(bank.id, testUser1.id);
        roomService.addUser(roomId, testUser1.id);
        roomService.removeUser(roomId, testUser1.id);

        const room = roomService.getRoom(roomId);
        expect(room).toBeUndefined();
    });

    it('should correctly remove user in vote', async () => {
        const roomId = await roomService.createRoom(bank.id, testUser1.id);
        roomService.addUser(roomId, testUser1.id);
        roomService.setUserReady(roomId, testUser1.id, true);

        const questions = await prisma.question.findMany({ where: { bankId: bank.id } });
        await roomService.vote(roomId, testUser1.id, questions[0].id, true);

        roomService.removeUser(roomId, testUser1.id);

        const room = roomService.getRoom(roomId);
        expect(room).toBeUndefined();
    });

    it('removed user does not apper in vote', async () => {
        const roomId = await roomService.createRoom(bank.id, testUser1.id);
        roomService.addUser(roomId, testUser1.id);
        roomService.addUser(roomId, testUser2.id);

        roomService.setUserReady(roomId, testUser1.id, true);
        roomService.setUserReady(roomId, testUser2.id, true);

        const questions = await prisma.question.findMany({ where: { bankId: bank.id } });
        await roomService.vote(roomId, testUser1.id, questions[0].id, true);
        await roomService.vote(roomId, testUser2.id, questions[0].id, true);

        roomService.removeUser(roomId, testUser2.id);

        await roomService.vote(roomId, testUser1.id, questions[1].id, true);

        const dbVotes = await prisma.vote.findMany({
            where: { creatorId: testUser1.id },
            include: { answers: true }
        });

        const testUser1InVote = dbVotes.some(vote =>
            vote.answers.some(a => a.userId === testUser1.id)
        );

        const testUser2InVote = dbVotes.some(vote =>
            vote.answers.some(a => a.userId === testUser2.id)
        );

        expect(testUser1InVote).toBe(true);
        expect(testUser2InVote).toBe(false);
    })
});