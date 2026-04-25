import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { QuestionBankService } from './services/question-bank.service';
import { CreateBankDto } from './dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayload } from '../auth/interfaces';
import { BankDto, CreateMediaBankDto, BankDetailDto, BankListItemDto, BankFilterDto, UpdateBankDto, BankImageDto } from './dto';
import { QuestionDto } from '../question/dto/question.dto';
import { QuestionBankCopyService } from './services/question-bank-copy.service';
import { CreateQuestionDto } from '../question/dto/create-question.dto';
import { QuestionService } from '../question/services/question.service';
import { QuestionBankImageService } from './services/question-bank-image.service';
import { imageUploadConfig } from '../shared/image/image-upload.config';
import { BankListDto } from './dto/bank-list.dto';

@ApiTags('question-banks')
@ApiBearerAuth()
@Controller('question-banks')
export class QuestionBankController {
  constructor(
    private readonly bankService: QuestionBankService,
    private readonly bankImageService: QuestionBankImageService,
    private readonly questionService: QuestionService,
    private readonly copyService: QuestionBankCopyService,
  ) { }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BankListDto})
  getBanks(
    @Body() filter: BankFilterDto,
    @Request() req: { user: JwtPayload },
  ) {
    const { categoryIds, locked, page, limit, text } = filter;
    return this.bankService.findAll(req.user.sub, locked, text, categoryIds, page, limit);
  }

  @Get('top')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BankListItemDto })
  @UseGuards(AuthGuard)
  getTopBanks(@Request() req: { user: JwtPayload }) {
    return this.bankService.findTopBanks(req.user.sub);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BankListItemDto })
  @UseGuards(AuthGuard)
  getBankById(@Param('id') id: string) {
    return this.bankService.findById(+id);
  }


  @Get(':id/details')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: BankDetailDto })
  @UseGuards(AuthGuard)
  getBankDetailsById(@Param('id') id: string) {
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
  getQuestionsByBankId(@Param('id') id: string) {
    return this.questionService.findQuestionsByBank(
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
    return this.questionService.createQuestion(
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
      dto.mediaType
    );
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: BankListItemDto })
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
  @UseInterceptors(FileInterceptor('file', imageUploadConfig),)
  @UseGuards(AuthGuard)
  uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.bankImageService.updateBankImage(+id, file.filename);
  }
}
