import { ApiProperty } from '@nestjs/swagger';

export class QuestionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty({ nullable: true, type: String })
  imageUrl: string | null;

  @ApiProperty()
  bankId: number;
}
