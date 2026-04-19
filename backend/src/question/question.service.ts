import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { ImageService } from '../shared/image/image.service';
import { updateQuestionDto } from './dto/update-question.dto';
import { QuestionImageDto } from './dto/question-image.dto';
import { CreateQuestionsDto } from './dto/create-questions.dto';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}

  findById(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  async createMany(
    bankId: number,
    dto: CreateQuestionsDto,
  ) {
    if (!dto.questions.length) {
      return;
    }

    return this.prisma.question.createMany({
      data: dto.questions.map((q) => ({
        bankId,
        text: q.text,
        imageUrl: q.imageUrl,
      })),
      skipDuplicates: true,
    });
  }

  async getAllQuestionsByBankId(id: number) {
    const questions =
      await this.prisma.question.findMany({
        where: { bankId: id },
      });

    return questions;
  }

  updateQuestion(
    id: number,
    dto: updateQuestionDto,
  ) {
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

  async updateQuestionImage(
    id: number,
    filename: string,
  ): Promise<QuestionImageDto> {
    const question = await this.findById(id);

    if (!question) {
      throw new NotFoundException(
        `Question with id ${id} not found`,
      );
    }

    const newFilename =
      await this.imageService.optimizeImage(
        filename,
      );

    await this.imageService.deleteIfExists(
      question.imageUrl,
    );

    return this.prisma.question.update({
      where: { id },
      data: { imageUrl: newFilename },
      select: { id: true, imageUrl: true },
    });
  }
}
