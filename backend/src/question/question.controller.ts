import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, UseGuards, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { QuestionService } from "./question.service";
import { QuestionDto } from "./dto/question.dto";
import { AuthGuard } from "../auth/auth.guard";
import { updateQuestionDto } from "./dto/update-question.dto";

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: QuestionDto})
    @UseGuards(AuthGuard)
    getQuestion(@Param('id') id: string) {
        return this.questionService.findById(+id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: QuestionDto})
    @UseGuards(AuthGuard)
    updateQuestion(@Param('id') id: string, @Body() dto: updateQuestionDto) {
        return this.questionService.updateQuestion(+id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    deleteQuestion(@Param('id') id: string) {
        return this.questionService.deleteQuestion(+id);
    }

    
}