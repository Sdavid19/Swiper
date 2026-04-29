import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength, } from 'class-validator';
import { ValidationMessages } from '../../shared/constants/validation-messages';

export class SignupDto {
  @IsEmail({}, { message: ValidationMessages.emailInvalid })
  @IsNotEmpty()
  @ApiProperty()
  @Length(3, 255, {message: ValidationMessages.emailLengthInvalid})
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(3, 20, {message: ValidationMessages.usernameLengthInvalid,})
  name: string;
}
