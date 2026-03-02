import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserImageDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string;

}
