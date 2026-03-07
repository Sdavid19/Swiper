import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UserService } from "./user.service";
import { JwtPayload } from "../auth/interfaces";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
        async getProfile(@Request() req: {user: JwtPayload}) {
        const userId = req.user.sub;
        return await this.userService.findUserById(userId);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch('profile')
    async updateProfile(
        @Request() req: { user: JwtPayload },
        @Body() body: UpdateUserDto
    ) {
        const userId = req.user.sub;
        return this.userService.updateUser(userId, body);
    }

    
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
        }
    }),
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return callback(new Error('Only image files allowed'), false);
        }
        callback(null, true)
    }
    }))
    uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.userService.updateUserImage(+id, file.filename);
    }

}