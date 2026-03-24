import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { updateQuestionDto } from "./dto/update-question.dto";

@Injectable()
export class QuestionService { 
    constructor(private readonly prisma: PrismaService){}

    async findById(id: number) {
        return this.prisma.question.findUnique({where: {id: id},})
    }

    async updateQuestion(id: number, dto: updateQuestionDto) {
        return this.prisma.question.update({
            where: {id},
            data: dto
        });
    }

    async deleteQuestion(id: number){
        return this.prisma.question.delete({
            where: {id}
        });
    }


}