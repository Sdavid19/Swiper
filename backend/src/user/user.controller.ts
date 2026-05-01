import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './services/user.service';
import { JwtPayload } from '../auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiTags, } from '@nestjs/swagger';
import { UserDto, UserImageDto, UpdateUserDto } from './dto';
import { imageUploadConfig } from '../shared/image/image-upload.config';
import { UserImageService } from './services/user-image.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userImageService: UserImageService
  ) { }

  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: UserDto })
  @Get('profile')
  async getProfile(
    @Request() req: { user: JwtPayload },
  ) {
    const userId = req.user.sub;
    return await this.userService.findUserById(
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  @Patch('profile')
  async updateProfile(@Request() req: { user: JwtPayload }, @Body() body: UpdateUserDto,
  ) {
    const userId = req.user.sub;
    return this.userService.updateUser(userId, body);
  }

  @Post('upload/:id')
  @ApiOkResponse({ type: UserImageDto })
  @UseInterceptors(FileInterceptor('file', imageUploadConfig),)
  @UseGuards(AuthGuard)
  uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.userImageService.updateUserImage(+id, file.filename,);
  }
}
