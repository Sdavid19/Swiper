import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateAnswerDto } from '../dto/create-answer.dto';
import { CreateVoteDataDto } from '../dto/create-vote-data.dto';
import { VoteDetailsDto } from '../dto/vote-details.dto';
import { VoteDto } from '../dto/vote.dto';
import { AnswerStatDto } from '../dto/answer-stat.dto';
import { AnswerTopStatsDto } from '../dto/answer-top-stats.dto';

@Injectable()
export class VoteService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async createVoteData(dto: CreateVoteDataDto) {
    const vote =
      await this.prismaService.vote.create({
        data: {
          title: 'Vote title',
          bankId: dto.bankId,
          creatorId: dto.creatorId,
          startsAt: new Date(),
          endsAt: new Date(),
        },
      });

    await this.createAnswers(
      dto.answers,
      vote.id,
    );

    return vote;
  }

  async createAnswers(
    dtos: CreateAnswerDto[],
    voteId: number,
  ) {
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
  ): Promise<VoteDto[]> {
    return this.prismaService.vote.findMany({
      where: {
        answers: {
          some: {
            userId,
          },
        },
      },
      include: {
        bank: {
          include: {
            creator: true,
            category: true,
          },
        },
      },
      orderBy: { startsAt: 'desc' },
    });
  }

  async getVoteById(
    voteId: number,
  ): Promise<VoteDetailsDto | null> {
    const vote =
      await this.prismaService.vote.findFirst({
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

  async getTopStats(voteId: number) {
    const answers =
      await this.prismaService.answer.findMany({
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
      .sort(
        (a, b) =>
          b.yes - a.yes ||
          a.question.text.localeCompare(
            a.question.text,
          ),
      );

    return {
      stats,
      userCount: totalUserCount,
    } as AnswerTopStatsDto;
  }
}
