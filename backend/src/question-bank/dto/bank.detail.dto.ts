import { ApiProperty } from '@nestjs/swagger';
import { QuestionDto } from '../../question/dto/question.dto';
import { BankDto } from './bank.dto';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class BankDetailDto extends BankDto {
  @ApiProperty({ type: [QuestionDto] })
  @IsArray()
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
