import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { ImageService } from '../../shared/image/image.service';
import { QuestionImageDto } from '../dto/question-image.dto';

@Injectable()
export class QuestionImageService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly imageService: ImageService,
  ) {}

  async updateQuestionImage(
    id: number,
    filename: string,
  ): Promise<QuestionImageDto> {
    const question =
      await this.questionService.findById(id);

    const newFilename =
      await this.imageService.optimizeImage(
        filename,
      );

    await this.imageService.deleteIfExists(
      question.imageUrl,
    );

    return this.questionService.updateImage(
      id,
      newFilename,
    );
  }
}
