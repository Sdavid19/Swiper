import { Module } from '@nestjs/common';
import { QuestionBankController } from './question-bank.controller';
import { QuestionBankService } from './services/question-bank.service';
import { CategoryModule } from '../category';
import { CategoryExists } from './validators/category-exitst.validator';
import { CategoriesExist } from './validators/categories-exists.validator';
import { QuestionBankTemplateService } from '../question-bank-template/question-bank-template.service';
import { ImageService } from '../shared/image/image.service';
import { QuestionBankCopyService } from './services/question-bank-copy.service';
import { QuestionModule } from '../question/question.module';
import { ImageModule } from '../shared/image/image.module';
import { QuestionService } from '../question/services/question.service';
import { QuestionBankImageService } from './services/question-bank-image.service';
import { MediaService } from '../media/services/media.service';

@Module({
  imports: [
    CategoryModule,
    QuestionModule,
    ImageModule,
    QuestionModule,
  ],
  controllers: [QuestionBankController],
  providers: [
    QuestionBankService,
    QuestionBankCopyService,
    CategoryExists,
    CategoriesExist,
    MediaService,
    QuestionBankTemplateService,
    ImageService,
    QuestionService,
    QuestionBankImageService,
  ],
  exports: [
    QuestionBankService,
    QuestionBankCopyService,
  ],
})
export class QuestioBankModule {}
