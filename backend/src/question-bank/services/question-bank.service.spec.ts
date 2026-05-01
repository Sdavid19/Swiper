import { Test, TestingModule } from '@nestjs/testing';
import { QuestionBankService } from './question-bank.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaService } from '../../media/services/media.service';
import { QuestionBankTemplateService } from '../../question-bank-template/question-bank-template.service';
import { QuestionService } from '../../question/services/question.service';
import { BankState } from '../dto';
import { CategoryService } from '../../category';

describe('QuestionBankService', () => {
    let service: QuestionBankService;

    const prismaMock = {
        questionBank: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionBankService,
                { provide: PrismaService, useValue: prismaMock },
                { provide: MediaService, useValue: {} },
                { provide: QuestionBankTemplateService, useValue: {} },
                { provide: QuestionService, useValue: {} },
                { provide: CategoryService, useValue: {} },
            ],
        }).compile();

        service = module.get<QuestionBankService>(QuestionBankService);

        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should call prisma with correct base structure', async () => {
            prismaMock.questionBank.findMany.mockResolvedValue([]);
            prismaMock.questionBank.count.mockResolvedValue(0);

            await service.findAll(1, BankState.ALL, undefined, undefined, 1, 10);

            expect(prismaMock.questionBank.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        creatorId: 1,
                    }),
                    skip: 0,
                    take: 10,
                }),
            );
        });

        it('should combine filters correctly', async () => {
            prismaMock.questionBank.findMany.mockResolvedValue([]);
            prismaMock.questionBank.count.mockResolvedValue(0);

            await service.findAll(42, BankState.OPEN, 'test', [1, 2], 2, 10);

            expect(prismaMock.questionBank.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        creatorId: 42,
                        categoryId: { in: [1, 2] },
                        votes: { none: {} },
                        OR: expect.any(Array),
                    }),
                    skip: 10,
                    take: 10,
                }),
            );
        });

        it('should calculate pagination correctly', async () => {
            prismaMock.questionBank.findMany.mockResolvedValue([]);
            prismaMock.questionBank.count.mockResolvedValue(100);

            const result = await service.findAll(1, BankState.ALL, undefined, undefined, 3, 10);

            expect(prismaMock.questionBank.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    skip: 20,
                    take: 10,
                }),
            );

            expect(result.hasMore).toBe(true);
        });

        it('should return hasMore = false when last page', async () => {
            prismaMock.questionBank.findMany.mockResolvedValue([{ id: 1 }]);
            prismaMock.questionBank.count.mockResolvedValue(10);

            const result = await service.findAll(1, BankState.ALL, undefined, undefined, 1, 10);

            expect(result.hasMore).toBe(false);
        });

        it('should map results to DTO', async () => {
            prismaMock.questionBank.findMany.mockResolvedValue([
                {
                    id: 1,
                    title: 'Test',
                    _count: { votes: 2, questions: 3 },
                },
            ]);

            prismaMock.questionBank.count.mockResolvedValue(1);

            const result = await service.findAll(1, BankState.ALL, undefined, undefined, 1, 10);

            expect(result.banks.length).toBe(1);
            expect(result.banks[0].voteCount).toBe(2);
            expect(result.banks[0].questionCount).toBe(3);
        });
    });

    describe('findTopBanks', () => {
        it('should call prisma with correct query', async () => {
            prismaMock.questionBank.findMany.mockResolvedValue([]);

            await service.findTopBanks(1);

            expect(prismaMock.questionBank.findMany).toHaveBeenCalledWith({
                where: { creatorId: 1 },
                include: expect.any(Object),
                orderBy: {
                    votes: {
                        _count: 'desc',
                    },
                },
                take: 3,
            });
        });

        it('should return mapped results', async () => {
            prismaMock.questionBank.findMany.mockResolvedValue([
                {
                    id: 1,
                    title: 'Bank 1',
                    _count: { votes: 10, questions: 5 },
                    category: {},
                    creator: {},
                },
            ]);

            const result = await service.findTopBanks(1);

            expect(result.length).toBe(1);
            expect(result[0].voteCount).toBe(10);
            expect(result[0].questionCount).toBe(5);
        });

    });
});