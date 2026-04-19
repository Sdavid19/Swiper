import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto';
import { SigninResponseDto } from './dto/signin.response.dto';
import { UserDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<UserDto> {
    const existing =
      await this.userService.findUserByEmail(
        dto.email,
      );

    if (existing) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Field error',
        message: {
          email: ['Email already exists'],
        },
      });
    }

    const user = this.userService.createUser(dto);

    return user;
  }

  async signin(
    dto: SigninDto,
  ): Promise<SigninResponseDto> {
    const user =
      await this.userService.findUserByEmail(
        dto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials!',
      );
    }

    const validPassword = await argon.verify(
      user.passwordHash,
      dto.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException(
        'Invalid credentials!',
      );
    }

    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl,
      },
    } as SigninResponseDto;
  }

  async verifyToken(token: string) {
    try {
      const payload =
        this.jwtService.verify(token);

      const user =
        await this.userService.findUserById(
          payload.sub,
        );

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
