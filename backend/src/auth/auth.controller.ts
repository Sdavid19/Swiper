import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from '../user';
import { JwtPayload } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  singIn(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: {user: JwtPayload}) {
    const userId = req.user.sub;
    return await this.userService.findUserById(userId);
  }
}
