import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { updateQuestionDto, CreateQuestionsDto, CreateQuestionDto, QuestionDto } from '../dto';
import { QuestionBankService } from '../../question-bank/services/question-bank.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findById(id: number,): Promise<QuestionDto> {
    const question = await this.prisma.question.findUnique({ where: { id } });

    if (!question) throw new NotFoundException(`Question with id ${id} not found!`,);

    return question;
  }

  async findQuestionsByBank(bankId: number,): Promise<QuestionDto[]> {
    const bank = await this.prisma.questionBank.findUnique({
      where: { id: bankId },
    });

    if (!bank) throw new NotFoundException(`There is no bank with id ${bankId}`);

    const questions = await this.prisma.question.findMany({ where: { bankId } });
    
    return questions;
  }

  async createQuestion(id: number, dto: CreateQuestionDto,) {
    const result = await this.prisma.question.create({
      data: {
        bankId: id,
        text: dto.text,
        description: dto.description
      },
    });

    return result;
  }

  async createMany(bankId: number, dto: CreateQuestionsDto,) {
    if (!dto.questions.length) {
      return;
    }

    return this.prisma.question.createMany({
      data: dto.questions.map((q) => ({
        bankId,
        description: q.description,
        text: q.text,
        imageUrl: q.imageUrl,
      })),
      skipDuplicates: true,
    });
  }

  async getAllQuestionsByBankId(id: number) {
    const questions = await this.prisma.question.findMany({
      where: { bankId: id },
    });

    return questions;
  }

  updateQuestion(id: number, dto: updateQuestionDto,) {
    return this.prisma.question.update({
      where: { id },
      data: dto,
    });
  }

  deleteQuestion(id: number) {
    return this.prisma.question.delete({
      where: { id },
    });
  }

  async updateImage(id: number, newFilename: string) {
    return this.prisma.question.update({
      where: { id },
      data: { imageUrl: newFilename },
      select: { id: true, imageUrl: true },
    });
  }
}
