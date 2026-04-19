import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  text: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string | null;
}
