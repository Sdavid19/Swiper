import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<UserDto> {
    const hash = await argon.hash(dto.password);

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

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: hash,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
      },
    });

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
}
