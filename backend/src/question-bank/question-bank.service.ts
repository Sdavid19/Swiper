import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { BankDto } from './dto/bank.dto';
import { BankImageDto } from './dto/bank-image.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import * as fs from 'fs';
import path from 'path';
import { CreateQuestionDto } from '../question/dto/create-question.dto';
import { QuestionDto } from '../question/dto/question.dto';
import sharp from 'sharp';
import { MediaService } from '../media';
import { CreateMediaQuestionDto } from '../question/dto/create-media-question.dto';
import { QuestionBankTemplateService } from '../question-bank-template/question-bank-template.service';
import { BankListItemDto } from './dto/bank-list-item.dto';
import { BankDetailDto } from './dto/bank.detail.dto';

@Injectable()
export class QuestionBankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly templateService: QuestionBankTemplateService,
  ) {}

  async findById(
    id: number,
  ): Promise<BankListItemDto | null> {
    const bank =
      await this.prisma.questionBank.findUnique({
        where: { id },
        include: {
          category: true,
          _count: {
            select: { votes: true },
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

    if (!bank) return null;

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

  async updateBankImage(
    id: number,
    filename: string,
  ): Promise<BankImageDto | null> {
    const bank =
      await this.prisma.questionBank.findUnique({
        where: { id },
      });

    if (!bank) {
      throw new NotFoundException(
        `Question with id ${id} not found`,
      );
    }

    const uploadsDir = path.join(
      process.cwd(),
      'uploads',
    );
    const oldImagePath = bank.imageUrl
      ? path.join(uploadsDir, bank.imageUrl)
      : null;
    const newImagePath = path.join(
      uploadsDir,
      `optimized-${filename}`,
    );

    await sharp(path.join(uploadsDir, filename))
      .resize(800)
      .jpeg({ quality: 70 })
      .toFile(newImagePath);

    fs.unlinkSync(
      path.join(uploadsDir, filename),
    );

    if (
      oldImagePath &&
      fs.existsSync(oldImagePath)
    ) {
      fs.unlinkSync(oldImagePath);
    }

    const imageUrl =
      await this.prisma.questionBank.update({
        where: { id },
        data: {
          imageUrl: `optimized-${filename}`,
        },
        select: { imageUrl: true },
      });

    return imageUrl;
  }

  async findQuestionsByBank(
    id: number,
  ): Promise<QuestionDto[]> {
    const questions =
      await this.prisma.question.findMany({
        where: { bankId: id },
      });

    return questions;
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

  async createQuestions(
    bankId: number,
    dtos: CreateMediaQuestionDto[],
  ) {
    await this.prisma.question.createMany({
      data: dtos.map((dto) => ({
        bankId,
        text: dto.text,
        imageUrl: dto.imageUrl,
      })),
      skipDuplicates: true,
    });
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

    const bank =
      await this.prisma.questionBank.create({
        data: {
          title: bankToCreateData.title,
          description:
            bankToCreateData.description,
          categoryId:
            bankToCreateData.category.id,
          imageUrl: bankToCreateData.imageUrl,
          creatorId: userId,
        },
      });

    await this.createQuestions(
      bank.id,
      media.map((m) => ({
        text: m.name,
        imageUrl: m.imageUrl,
      })),
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
      creator: bank.creator,
    };
  }
}
