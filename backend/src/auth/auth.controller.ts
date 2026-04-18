import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { SigninDto } from './dto/signin.dto';
import {
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SigninResponseDto } from './dto/signin.response.dto';
import { UserDto } from '../user/dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
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
