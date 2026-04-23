import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ValidationMessages } from '../../shared/constants/validation-messages';

export class SigninDto {
  @IsEmail({}, {message: ValidationMessages.emailInvalid})
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
