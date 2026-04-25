import { Injectable } from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';
import { ImageService } from '../../shared/image/image.service';
import { BankImageDto } from '../dto/bank-image.dto';

@Injectable()
export class QuestionBankImageService {
  constructor(
    private readonly questionBankServie: QuestionBankService,
    private readonly imageService: ImageService,
  ) { }

  async updateBankImage(id: number, filename: string,): Promise<BankImageDto> {
    const bank = await this.questionBankServie.findById(id);

    const newFilename = await this.imageService.optimizeImage(filename);

    await this.imageService.deleteIfExists(bank.imageUrl);
    
    return this.questionBankServie.updateImage(id, newFilename);
  }
}
