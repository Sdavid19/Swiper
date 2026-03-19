import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { QuestionBankService } from "./question-bank.service";
import { CreateBankDto } from "./dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BankDto } from "./dto/bank.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path, { extname } from "path";
import { BankImageDto } from "./dto/bank-image.dto";
import { UpdateBankDto } from "./dto/update-bank.dto";
import { AuthGuard } from "../auth/auth.guard";
import { JwtPayload } from "../auth/interfaces";
import { BankFilterDto } from "./dto/bank-filter.dto";


@ApiTags('question-banks')
@ApiBearerAuth()
@Controller('question-banks')
export class QuestionBankController{
    constructor(private readonly bankService: QuestionBankService) { }

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    getBanks(
        @Body() filter: BankFilterDto,
    ) {
        const categoryIds = filter.categoryIds; 
        console.log(categoryIds)
        return this.bankService.findAll(categoryIds);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({type: BankDto})
    getBank(@Param('id') id: string) {
        return this.bankService.findById(+id);
    }

    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({type: BankDto})
    createBank(@Body() dto: CreateBankDto) {
        return this.bankService.create(dto);
    }

    @Put("/:id")
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({type: BankDto})
    updateBank(@Param('id') id: string, @Body() dto: UpdateBankDto) {
        return this.bankService.update(+id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    deleteBank(@Param('id') id: string) {
        return this.bankService.delete(+id);
    }

    @Post('upload/:id')
    @ApiOkResponse({type: BankImageDto})
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
   
        return this.bankService.updateBankImage(+id, file.filename);
    }
}