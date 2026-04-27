import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags, } from '@nestjs/swagger';
import { SignupDto, SigninDto, SigninResponseDto } from './dto';
import { UserDto } from '../user/dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiOkResponse({ type: UserDto })
  signUp(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({ type: SigninResponseDto })
  singIn(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }
}
