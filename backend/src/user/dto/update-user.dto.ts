import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty({ required: false })
  password?: string;
}
