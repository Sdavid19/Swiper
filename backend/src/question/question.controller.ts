import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, UseGuards, Delete, UseInterceptors, UploadedFile, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { QuestionService } from "./question.service";
import { QuestionDto } from "./dto/question.dto";
import { AuthGuard } from "../auth/auth.guard";
import { updateQuestionDto } from "./dto/update-question.dto";
import { QuestionImageDto } from "./dto/question-image.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

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
    updateQuestion(@Param('id') id: string, @Body() dto: updateQuestionDto) {
        return this.questionService.updateQuestion(+id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    deleteQuestion(@Param('id') id: string) {
        return this.questionService.deleteQuestion(+id);
    }

    @Post('upload/:id')
    @ApiOkResponse({ type: QuestionImageDto })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, uniqueSuffix + extname(file.originalname));
            }
        }),
        limits: {
            fileSize: 1024 * 1024
        },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return callback(new Error('Only image files allowed'), false);
            }
            callback(null, true)
        }
    }))
    @UseGuards(AuthGuard)
    uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.questionService.updateQuestionImage(+id, file.filename);
    }


}