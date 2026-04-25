import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBankDto } from '../dto/create-bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { CreateQuestionDto } from '../../question/dto/create-question.dto';
import { QuestionBankTemplateService } from '../../question-bank-template/question-bank-template.service';
import { BankListItemDto } from '../dto/bank-list-item.dto';
import { BankDetailDto } from '../dto/bank.detail.dto';
import { QuestionService } from '../../question/services/question.service';
import { MediaService } from '../../media/services/media.service';
import { MediaType, Prisma } from '@prisma/client';
import { BankListDto } from '../dto/bank-list.dto';

const BANK_LIST_INCLUDE = {
  category: true,
  _count: {
    select: {
      votes: true,
      questions: true,
    },
  },
  creator: {
    select: {
      id: true,
      email: true,
      name: true,
      imageUrl: true,
    },
  },
} as const;

@Injectable()
export class QuestionBankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly templateService: QuestionBankTemplateService,
    private readonly questionService: QuestionService,
  ) { }

  async findById(id: number): Promise<BankListItemDto> {
    const bank = await this.prisma.questionBank.findUnique({
      where: { id },
      include: BANK_LIST_INCLUDE,
    });

    if (!bank) throw new NotFoundException();

    return this.mapToBankListItemDto(bank);
  }

  async findTopBanks(userId: number): Promise<BankListItemDto[]> {
    const banks = await this.prisma.questionBank.findMany({
      where: { creatorId: userId },
      include: BANK_LIST_INCLUDE,
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
      take: 3,
    });

    return banks.map(this.mapToBankListItemDto.bind(this));
  }

  async findByIdWithQuestions(
    id: number,
  ): Promise<BankDetailDto | null> {
    const bank = await this.prisma.questionBank.findUnique({
      where: { id },
      include: {
        category: true,
        questions: true,
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!bank) return null;

    return bank;
  }

  async findAll(
    userId: number,
    locked: boolean,
    text?: string,
    categoryIds?: number[],
    page: number = 1,
    limit: number = 20,
  ): Promise<BankListDto> {

    const where: Prisma.QuestionBankWhereInput = {
      creatorId: userId,

      ...(categoryIds?.length
        ? { categoryId: { in: categoryIds } }
        : {}),

      votes: locked ? { some: {} } : { none: {} },

      ...this.buildBankTextSearch(text),
    };

    const [data, total] = await Promise.all([
      this.prisma.questionBank.findMany({
        where,
        include: BANK_LIST_INCLUDE,
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.questionBank.count({ where }),
    ]);

    return {
      banks: data.map(this.mapToBankListItemDto.bind(this)),
      hasMore: page * limit < total,
    };
  }

  async update(
    id: number,
    dto: UpdateBankDto,
  ): Promise<BankListItemDto> {
    const data = await this.prisma.questionBank.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
      },
      include: BANK_LIST_INCLUDE,
    });

    return this.mapToBankListItemDto(data);
  }

  async create(dto: CreateBankDto): Promise<BankListItemDto> {
    const bank = await this.prisma.questionBank.create({
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        creatorId: dto.creatorId,
      },
      include: BANK_LIST_INCLUDE,
    });

    return this.mapToBankListItemDto(bank);
  }

  async delete(id: number) {
    return this.prisma.questionBank.delete({
      where: { id },
    });
  }

  async updateImage(id: number, newFilename: string) {
    return this.prisma.questionBank.update({
      where: { id },
      data: { imageUrl: newFilename },
      select: {
        id: true,
        imageUrl: true,
      },
    });
  }

  async createQuestion(id: number, dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        bankId: id,
        text: dto.text,
      },
    });
  }

  async createQuestionBankByMedia(
    platformNames: string[] | undefined,
    templateId: number,
    userId: number,
    mediaType: MediaType,
  ) {
    const media = await this.mediaService.findMediaByPlatforms(mediaType, platformNames);

    const template = await this.templateService.findById(templateId);

    if (!template) {
      throw new NotFoundException(`Template with id ${templateId} doesn't exist!`,);
    }

    const bank = await this.create({
      title: template.title,
      description: template.description,
      categoryId: template.category.id,
      imageUrl: template.imageUrl,
      creatorId: userId,
    });

    await this.questionService.createMany(bank.id, {
      questions: media.map((m) => ({
        text: m.name,
        description: m.description ?? undefined,
        imageUrl: m.imageUrl,
      })),
    });

    return bank;
  }

  private mapToBankListItemDto(bank: any): BankListItemDto {
    return {
      id: bank.id,
      title: bank.title,
      category: bank.category,
      description: bank.description,
      createdAt: bank.createdAt,
      imageUrl: bank.imageUrl,
      public: bank.public,
      updatedAt: bank.updatedAt,
      usageCount: bank.usageCount,
      voteCount: bank._count?.votes ?? 0,
      questionCount: bank._count?.questions ?? 0,
      creator: bank.creator,
    };
  }

  buildBankTextSearch(text?: string): Prisma.QuestionBankWhereInput {
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
          description: {
            contains: text,
            mode: "insensitive",
          },
        },
      ],
    };
  }
}