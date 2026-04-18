import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto';

export class SigninResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: UserDto;
}
