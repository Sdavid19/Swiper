import { Injectable, NotFoundException } from '@nestjs/common';
import { BankDto } from '../dto/bank.dto';
import { QuestionBankService } from './question-bank.service';
import { QuestionService } from '../../question/services/question.service';

@Injectable()
export class QuestionBankCopyService {
  constructor(
    private readonly questionsService: QuestionService,
    private readonly bankService: QuestionBankService,
  ) { }

  async copy(id: number): Promise<BankDto> {
    const bank = await this.bankService.findById(id);

    if (!bank) throw new NotFoundException(`Questionbank with id ${id} not found!`,);

    const questions = await this.questionsService.getAllQuestionsByBankId(bank.id,);

    const createdBank = await this.bankService.create({
      public: bank.public,
      title: `${bank.title} copy`,
      imageUrl: bank.imageUrl,
      creatorId: bank.creator.id,
      categoryId: bank.category.id,
      description: bank.description,
    });

    const questionsToCreate = questions.map((question) => ({
      text: question.text,
      description: question.description ?? undefined,
      imageUrl: question.imageUrl,
    }));

    await this.questionsService.createMany(createdBank.id, { questions: questionsToCreate })

    return createdBank;
  }
}
