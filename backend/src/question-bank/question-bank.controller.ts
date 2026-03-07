import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { QuestionBankService } from "./question-bank.service";
import { CreateBankDto } from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('question-banks')
@ApiBearerAuth()
@Controller('question-banks')
export class QuestionBankController{
    constructor(private readonly bankService: QuestionBankService) { }

    @Get()
    getBanks(@Query('category') category?: string) {
        const categoryId = category !== undefined ? +category : undefined;
        return this.bankService.findAll(categoryId);
    }

    @Post()
    createBank(@Body() dto: CreateBankDto) {
        return this.bankService.create(dto);
    }

    @Delete(':id')
    deleteBank(@Param('id') id: string) {
        return this.bankService.delete(+id);
    }
}