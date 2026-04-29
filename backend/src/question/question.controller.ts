import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { QuestionImageService } from './services/question-image.service';
import { imageUploadConfig } from '../shared/image/image-upload.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionService } from './services/question.service';
import { updateQuestionDto, QuestionDto, QuestionImageDto } from './dto';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly questionImageService: QuestionImageService,
  ) { }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: QuestionDto })
  @UseGuards(AuthGuard)
  getQuestion(@Param('id') id: string) {
    return this.questionService.findById(+id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: QuestionDto })
  @UseGuards(AuthGuard)
  updateQuestion(
    @Param('id') id: string,
    @Body() dto: updateQuestionDto,
  ) {
    return this.questionService.updateQuestion(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  deleteQuestion(@Param('id') id: string) {
    this.questionService.deleteQuestion(+id);
  }

  @Post('upload/:id')
  @ApiOkResponse({ type: QuestionImageDto })
  @UseInterceptors(
    FileInterceptor('file', imageUploadConfig),
  )
  @UseGuards(AuthGuard)
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.questionImageService.updateQuestionImage(+id, file.filename);
  }
}
