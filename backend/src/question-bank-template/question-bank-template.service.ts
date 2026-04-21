import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { dmmfToRuntimeDataModel } from '@prisma/client/runtime/library';

@Injectable()
export class QuestionBankTemplateService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.questionBankTemplate.findMany(
      {
        include: { category: true },
      },
    );
  }

  async findById(id: number) {
    return this.prisma.questionBankTemplate.findFirst(
      {
        where: { id },
        include: {
          category: true,
        },
      },
    );
  }
}
