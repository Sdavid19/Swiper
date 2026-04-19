import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './services/question.service';
import { ImageService } from '../shared/image/image.service';
import { QuestionImageService } from './services/question-image.service';

@Module({
  controllers: [QuestionController],
  providers: [
    QuestionService,
    ImageService,
    QuestionImageService,
  ],
  exports: [QuestionService],
})
export class QuestionModule {}
