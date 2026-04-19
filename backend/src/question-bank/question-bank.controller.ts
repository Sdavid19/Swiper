import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuestionBankService } from './services/question-bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BankDto } from './dto/bank.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BankImageDto } from './dto/bank-image.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayload } from '../auth/interfaces';
import { BankFilterDto } from './dto/bank-filter.dto';
import { CreateQuestionDto } from '../question/dto/create-question.dto';
import { QuestionDto } from '../question/dto/question.dto';
import { CreateMediaBankDto } from './dto/create-media-bank.dto';
import { BankDetailDto } from './dto/bank.detail.dto';
import { BankListItemDto } from './dto/bank-list-item.dto';
import { QuestionBankCopyService } from './services/question-bank-copy.service';

@ApiTags('question-banks')
@ApiBearerAuth()
@Controller('question-banks')
export class QuestionBankController {
  constructor(
    private readonly bankService: QuestionBankService,
    private readonly copyService: QuestionBankCopyService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BankDto, isArray: true })
  getBanks(
    @Body() filter: BankFilterDto,
    @Request() req: { user: JwtPayload },
  ) {
    const categoryIds = filter.categoryIds;
    return this.bankService.findAll(
      req.user.sub,
      categoryIds,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BankDto })
  @UseGuards(AuthGuard)
  getBank(@Param('id') id: string) {
    return this.bankService.findById(+id);
  }

  @Get(':id/details')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BankDetailDto })
  @UseGuards(AuthGuard)
  getBankDetails(@Param('id') id: string) {
    return this.bankService.findByIdWithQuestions(
      +id,
    );
  }

  @Get(':id/questions')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: QuestionDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  getQuestionsByBank(@Param('id') id: string) {
    return this.bankService.findQuestionsByBank(
      +id,
    );
  }

  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: CreateQuestionDto })
  @UseGuards(AuthGuard)
  copyQuestionBank(@Param('id') id: string) {
    return this.copyService.copy(+id);
  }

  @Post(':id/questions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: CreateQuestionDto })
  @UseGuards(AuthGuard)
  createQuestionsForBank(
    @Param('id') id: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.bankService.createQuestion(
      +id,
      dto,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: BankListItemDto })
  @UseGuards(AuthGuard)
  createBank(@Body() dto: CreateBankDto) {
    return this.bankService.create(dto);
  }

  @Post('create-media')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: BankDto })
  @UseGuards(AuthGuard)
  createMediaBank(
    @Body() dto: CreateMediaBankDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.bankService.createQuestionBankByMedia(
      dto.platforms,
      dto.bankTemplateId,
      req.user.sub,
    );
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: BankDto })
  @UseGuards(AuthGuard)
  updateBank(
    @Param('id') id: string,
    @Body() dto: UpdateBankDto,
  ) {
    return this.bankService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  deleteBank(@Param('id') id: string) {
    return this.bankService.delete(+id);
  }

  @Post('upload/:id')
  @ApiOkResponse({ type: BankImageDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);
          callback(
            null,
            uniqueSuffix +
              extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, callback) => {
        if (
          !file.mimetype.match(
            /\/(jpg|jpeg|png|webp)$/,
          )
        ) {
          return callback(
            new Error('Only image files allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024,
      },
    }),
  )
  @UseGuards(AuthGuard)
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bankService.updateBankImage(
      +id,
      file.filename,
    );
  }
}
