import { ApiProperty } from "@nestjs/swagger";

export class UserImageDto {
  @ApiProperty({ nullable: true, type: String })
  imageUrl: string | null;
}
