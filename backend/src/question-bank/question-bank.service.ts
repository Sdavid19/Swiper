import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBankDto } from "./dto";

@Injectable()
export class QuestionBankService { 
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number) {
        return this.prisma.questionBank.findUnique({where: {id: id}})
    }
    
    findAll(categoryId: number | undefined) {
        return this.prisma.questionBank.findMany({
            where: categoryId ? { categoryId: categoryId } : undefined
        });
    }

    create(dto: CreateBankDto) {
        const bank = this.prisma.questionBank.create({
            data: {...dto},
            select: {
                id: true,
                title: true
            }
        });
        
        return bank;
    }

    async delete(id: number) {
        const bank = await this.findById(id);

        if (!bank) {
            throw new NotFoundException(`Questionbank with id ${id} not found`);
        }
        
        return this.prisma.questionBank.delete({ where: {id} });
    }
}