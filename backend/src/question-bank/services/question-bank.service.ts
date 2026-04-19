import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBankDto } from '../dto/create-bank.dto';
import { BankDto } from '../dto/bank.dto';
import { UpdateBankDto } from '../dto/update-bank.dto';
import { CreateQuestionDto } from '../../question/dto/create-question.dto';
import { QuestionBankTemplateService } from '../../question-bank-template/question-bank-template.service';
import { BankListItemDto } from '../dto/bank-list-item.dto';
import { BankDetailDto } from '../dto/bank.detail.dto';
import { ImageService } from '../../shared/image/image.service';
import { QuestionService } from '../../question/services/question.service';
import { MediaService } from '../../media/services/media.service';

@Injectable()
export class QuestionBankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly templateService: QuestionBankTemplateService,
    private readonly questionService: QuestionService,
  ) {}

  async findById(
    id: number,
  ): Promise<BankListItemDto> {
    const bank =
      await this.prisma.questionBank.findUnique({
        where: { id },
        include: {
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
        },
      });

    if (!bank) throw new NotFoundException();

    return this.mapToBankListItemDto(bank);
  }

  async findByIdWithQuestions(
    id: number,
  ): Promise<BankDetailDto | null> {
    const bank =
      await this.prisma.questionBank.findUnique({
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

  findAll(
    userId: number,
    categoryIds?: number[],
  ): Promise<BankDto[]> {
    return this.prisma.questionBank.findMany({
      where: {
        creatorId: userId,
        ...(categoryIds && categoryIds.length > 0
          ? { categoryId: { in: categoryIds } }
          : {}),
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
  }

  update(
    id: number,
    dto: UpdateBankDto,
  ): Promise<BankDto> {
    return this.prisma.questionBank.update({
      where: { id },
      data: { ...dto },
      include: {
        category: true,
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
  }

  create(dto: CreateBankDto): Promise<BankDto> {
    const bank = this.prisma.questionBank.create({
      data: { ...dto },
      include: {
        category: true,
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

    return bank;
  }

  async delete(id: number) {
    return this.prisma.questionBank.delete({
      where: { id },
    });
  }

  async updateImage(
    id: number,
    newFilename: string,
  ) {
    return this.prisma.questionBank.update({
      where: { id },
      data: { imageUrl: newFilename },
      select: { id: true, imageUrl: true },
    });
  }

  async createQuestion(
    id: number,
    dto: CreateQuestionDto,
  ) {
    const result =
      await this.prisma.question.create({
        data: {
          bankId: id,
          text: dto.text,
        },
      });

    return result;
  }

  async createQuestionBankByMedia(
    platformNames: string[] | undefined,
    templateId: number,
    userId: number,
  ) {
    const media =
      await this.mediaService.findMediaByPlatforms(
        platformNames,
      );

    const bankToCreateData =
      await this.templateService.findById(
        templateId,
      );

    if (!bankToCreateData)
      throw new NotFoundException(
        `Template with id ${templateId} dosen't exist!`,
      );

    const bank = await this.create({
      title: bankToCreateData.title,
      description: bankToCreateData.description,
      categoryId: bankToCreateData.category.id,
      imageUrl: bankToCreateData.imageUrl,
      creatorId: userId,
    });

    await this.questionService.createMany(
      bank.id,
      {
        questions: media.map((m) => ({
          text: m.name,
          imageUrl: m.imageUrl,
        })),
      },
    );

    return bank;
  }

  private mapToBankListItemDto(
    bank: any,
  ): BankListItemDto {
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
      questionCount: bank._count?.votes ?? 0,
      creator: bank.creator,
    };
  }
}
