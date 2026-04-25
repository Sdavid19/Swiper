import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { VoteFilterDto, CreateAnswerDto, AnswerTopStatsDto, AnswerStatDto, VoteDetailsDto, VoteDto, CreateVoteDataDto } from '../dto';
import { Prisma } from '@prisma/client';
import { UserService } from '../../user/services/user.service';
import { VoteListDto } from '../dto/vote-list.dto';

@Injectable()
export class VoteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userSerice: UserService
  ) { }


  async createVoteData(dto: CreateVoteDataDto) {

    const creator = await this.userSerice.findUserById(dto.creatorId);

    const vote = await this.prismaService.vote.create({
      data: {
        title: `${creator.name}'s vote`,
        bankId: dto.bankId,
        creatorId: dto.creatorId,
        startsAt: dto.startDate,
        endsAt: dto.endDate,
      },
    });

    await this.createAnswers(dto.answers, vote.id);

    return vote;
  }

  async createAnswers(dtos: CreateAnswerDto[], voteId: number) {
    return this.prismaService.answer.createMany({
      data: dtos.map((answer) => ({
        answer: answer.answer,
        userId: answer.userId,
        voteId,
        questionId: answer.questionId,
      })),
    });
  }

  async getAllVotesUserParticipatedIn(
    userId: number,
    date?: Date,
    text?: string,
    page: number = 1,
    limit: number = 20,
    categoryIds?: number[]
  ): Promise<VoteListDto> {

    const where: Prisma.VoteWhereInput = {
      bank: {
        ...(categoryIds?.length
          ? {
            category: {
              id: { in: categoryIds },
            },
          }
          : {}),
      },
      answers: { some: { userId } },
      ...this.buildVoteDateFilter(date),
      ...this.buildVoteTextSearch(text),
    };

    const [data, total] = await Promise.all([
      this.prismaService.vote.findMany({
        where,
        include: {
          bank: {
            include: {
              creator: true,
              category: true,
            },
          },
        },
        orderBy: { startsAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prismaService.vote.count({ where }),
    ]);

    return { votes: data, hasMore: page * limit < total };
  }

  async getVoteById(voteId: number,): Promise<VoteDetailsDto | null> {
    const vote = await this.prismaService.vote.findFirst({
      where: { id: voteId },
      include: {
        bank: {
          include: {
            creator: true,
            category: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!vote) return null;

    return vote;
  }

  async getTopStats(voteId: number, userId: number) {
    const vote = await this.prismaService.vote.findFirst(
      {
        where: {
          id: voteId,
          answers: {
            some: {
              userId,
            },
          },
        }
      }
    )

    if (!vote) throw new NotFoundException("Vote not found");

    const answers = await this.prismaService.answer.findMany({
      where: { voteId },
      include: { question: true, user: true },
    });

    const totalUserCount = new Set(
      answers.map((a) => a.userId),
    ).size;

    const stat = new Map<number, AnswerStatDto>();

    answers.forEach((ans) => {
      const questionId = ans.questionId;
      const isYes = ans.answer;

      if (!stat.has(questionId)) {
        stat.set(questionId, {
          yes: 0,
          no: 0,
          question: ans.question,
          answers: [],
        });
      }

      const entry = stat.get(questionId)!;

      if (isYes) {
        entry.yes += 1;
      } else {
        entry.no += 1;
      }

      entry.answers.push({
        user: ans.user,
        answer: isYes,
      });
    });

    const stats = Array.from(stat.entries())
      .map(([questionId, questionStat]) => ({
        questionId,
        ...questionStat,
      }))
      .sort((a, b) => b.yes - a.yes || a.question.text.localeCompare(a.question.text));

    return {
      stats,
      userCount: totalUserCount,
    } as AnswerTopStatsDto;
  }

  buildVoteDateFilter(date?: Date): Prisma.VoteWhereInput {
    if (!date) return {};

    const d = new Date(date);

    if (isNaN(d.getTime())) return {};

    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    return {
      startsAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    };
  }

  buildVoteTextSearch(text?: string): Prisma.VoteWhereInput {
    if (!text?.trim()) return {};

    return {
      OR: [
        {
          title: {
            contains: text,
            mode: "insensitive",
          },
        },
        {
          bank: {
            is: {
              title: {
                contains: text,
                mode: "insensitive",
              },
            },
          },
        },
        {
          bank: {
            is: {
              description: {
                contains: text,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    };
  }

}
