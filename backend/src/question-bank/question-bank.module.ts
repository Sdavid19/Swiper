import { Module } from '@nestjs/common';
import { QuestionBankController } from './question-bank.controller';
import { QuestionBankService } from './services/question-bank.service';
import { CategoryModule } from '../category';
import { CategoryExists } from './validators/category-exitst.validator';
import { CategoriesExist } from './validators/categories-exists.validator';
import { QuestionBankTemplateService } from '../question-bank-template/question-bank-template.service';
import { QuestionBankCopyService } from './services/question-bank-copy.service';
import { QuestionModule } from '../question/question.module';
import { ImageModule } from '../shared/image/image.module';
import { QuestionBankImageService } from './services/question-bank-image.service';
import { MediaModule } from '../media';

@Module({
  imports: [
    CategoryModule,
    QuestionModule,
    ImageModule,
    QuestionModule,
    MediaModule
  ],
  controllers: [QuestionBankController],
  providers: [
    QuestionBankService,
    QuestionBankCopyService,
    CategoryExists,
    CategoriesExist,
    QuestionBankTemplateService,
    QuestionBankImageService,
  ],
  exports: [
    QuestionBankService,
    QuestionBankCopyService,
  ],
})
export class QuestioBankModule {}
