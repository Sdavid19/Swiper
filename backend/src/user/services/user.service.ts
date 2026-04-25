import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../../prisma';
import { SignupDto } from '../../auth/dto';
import { UpdateUserDto, UserDto, UserImageDto } from '../dto';


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findUserById(id: number) {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found`,
      );
    }

    return user;
  }

  async createUser(
    dto: SignupDto,
  ): Promise<UserDto> {
    const existingUser =
      await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

    if (existingUser) {
      throw new BadRequestException(
        'Email already in use',
      );
    }

    const hashedPassword = await argon.hash(
      dto.password,
    );

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });

    return user;
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email },
    });
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
  ): Promise<UserDto> {
    const data: UpdateUserDto = {};

    if (dto.name) {
      data.name = dto.name;
    }

    if (dto.password) {
      data.password = await argon.hash(
        dto.password,
      );
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        passwordHash: data.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
      },
    });

    return user;
  }

    async updateImage(id: number, newFilename: string) {
    return this.prisma.questionBank.update({
      where: { id },
      data: { imageUrl: newFilename },
      select: {
        id: true,
        imageUrl: true,
      },
    });
  }
}
