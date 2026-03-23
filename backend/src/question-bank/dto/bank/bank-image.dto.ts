import { ApiProperty } from "@nestjs/swagger";

export class BankImageDto {
  @ApiProperty({ nullable: true, type: String })
  imageUrl: string | null;
}
