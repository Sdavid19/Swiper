import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { QuestionBankTemplateService } from './question-bank-template.service';
import { QuestionBankTemplateDto } from './dto/question-bank-template.dto';

@ApiTags('question-banks')
@ApiBearerAuth()
@Controller('question-bank-templates')
export class QuestionBankTemplateController {
  constructor(
    private readonly templateService: QuestionBankTemplateService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: QuestionBankTemplateDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  getTemplates() {
    return this.templateService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: QuestionBankTemplateDto,
  })
  @UseGuards(AuthGuard)
  getTemplate(@Param('id') id: string) {
    return this.templateService.findById(+id);
  }
}
