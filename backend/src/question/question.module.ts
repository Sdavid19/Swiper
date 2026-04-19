import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { ImageService } from '../shared/image/image.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, ImageService],
  exports: [QuestionService],
})
export class QuestionModule {}
