import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { VoteService } from './vote.service';
import { PrismaService } from '../../prisma';

describe('VoteService - getTopStats', () => {
  let service: VoteService;

  const mockPrisma = {
    answer: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          VoteService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
        ],
      }).compile();

    service =
      module.get<VoteService>(VoteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate vote statistics correctly', async () => {
    // 🔥 A te Prisma modelledhez igazított mock data (Answer entity)
    mockPrisma.answer.findMany.mockResolvedValue([
      {
        id: 1,
        answer: true,
        userId: 1,
        voteId: 10,
        questionId: 100,
        createdAt: new Date(),

        question: {
          id: 100,
          text: 'Is NestJS good?',
          imageUrl: null,
          bankId: 1,
        },

        user: {
          id: 1,
          name: 'User1',
          email: 'u1@test.com',
          passwordHash: 'hash',
          isAdmin: false,
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        id: 2,
        answer: false,
        userId: 2,
        voteId: 10,
        questionId: 100,
        createdAt: new Date(),

        question: {
          id: 100,
          text: 'Is NestJS good?',
          imageUrl: null,
          bankId: 1,
        },

        user: {
          id: 2,
          name: 'User2',
          email: 'u2@test.com',
          passwordHash: 'hash',
          isAdmin: false,
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        id: 3,
        answer: true,
        userId: 1,
        voteId: 10,
        questionId: 200,
        createdAt: new Date(),

        question: {
          id: 200,
          text: 'Is TypeScript useful?',
          imageUrl: null,
          bankId: 1,
        },

        user: {
          id: 1,
          name: 'User1',
          email: 'u1@test.com',
          passwordHash: 'hash',
          isAdmin: false,
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ]);

    const result = await service.getTopStats(10);

    expect(result.userCount).toBe(2);

    expect(result.stats.length).toBe(2);

    const q1 = result.stats.find(
      (s) => s.question.id === 100,
    );

    expect(q1).toBeDefined();
    expect(q1?.yes).toBe(1);
    expect(q1?.no).toBe(1);
    expect(q1?.answers.length).toBe(2);
    expect(q1?.question.text).toBe(
      'Is NestJS good?',
    );

    const q2 = result.stats.find(
      (s) => s.question.id === 200,
    );

    expect(q2).toBeDefined();
    expect(q2?.yes).toBe(1);
    expect(q2?.no).toBe(0);
    expect(q2?.answers.length).toBe(1);
  });
});
