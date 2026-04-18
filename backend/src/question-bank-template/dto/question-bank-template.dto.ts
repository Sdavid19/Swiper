import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from '../../category/dto';

export class QuestionBankTemplateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: () => CategoryDto })
  category: CategoryDto;

  @ApiProperty({ nullable: true, type: String })
  imageUrl: string | null;
}
