import { ApiProperty } from '@nestjs/swagger';

export class BankFilterDto {
  @ApiProperty({ required: false })
  categoryId?: number;

  @ApiProperty({ required: false })
  search?: string;

  @ApiProperty({ required: false })
  onlyMine?: boolean;
}