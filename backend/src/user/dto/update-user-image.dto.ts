import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserImageDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  imageUrl: string;

}
