import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBankDto } from "./dto/bank/create-bank.dto";
import { BankDto } from "./dto/bank/bank.dto";
import { BankImageDto } from "./dto/bank/bank-image.dto";
import { UpdateBankDto } from "./dto/bank/update-bank.dto";
import * as fs from 'fs';
import path from "path";
import { CreateQuestionDto } from "./dto/question/create-question.dto";
import { QuestionDto } from "./dto/question/question.dto";

@Injectable()
export class QuestionBankService { 
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number) {
        return this.prisma.questionBank.findUnique({where: {id: id},
            include: {
                category: true, 
                creator: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        imageUrl: true
                    }
                }
            },
        })
    }
    
    findAll(userId: number, categoryIds?: number[]): Promise<BankDto[]> {
    return this.prisma.questionBank.findMany({
        where: {
        creatorId: userId,
        ...(categoryIds && categoryIds.length > 0
            ? { categoryId: { in: categoryIds } }
            : {}),
        },
        include: {
        category: true,
        creator: {
            select: {
            id: true,
            email: true,
            name: true,
            imageUrl: true,
            },
        },
        },
        orderBy: {
        title: 'asc',
        },
    });
    }

    update(id: number, dto: UpdateBankDto): Promise<BankDto>{
        return this.prisma.questionBank.update({
            where: {id},
            data: {...dto},
            include: {
                category: true, 
                creator: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        imageUrl: true
                    }
                }
            },
        });
    }

    create(dto: CreateBankDto): Promise<BankDto> {
        const bank = this.prisma.questionBank.create({
            data: {...dto},
             include: {
                category: true, 
                creator: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        imageUrl: true
                    }
                }
            },
        });
        
        return bank;
    }

    async delete(id: number) {
        const bank = await this.findById(id);

        if (!bank) {
            throw new NotFoundException(`Questionbank with id ${id} not found`);
        }
        
        return this.prisma.questionBank.delete({ where: {id}, select: {id: true} });
    }


    async updateBankImage(id: number, filename: string): Promise<BankImageDto | null> {
        const bank = await this.prisma.questionBank.findUnique({
        where: { id }
    });

        if (!bank) {
            throw new NotFoundException(`Questionbank with id ${id} not found`);
        }

        if (bank.imageUrl) {
            const oldImagePath = path.join(process.cwd(), 'uploads', bank.imageUrl);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const imageUrl = await this.prisma.questionBank.update({
            where: { id },
            data: { imageUrl: filename },
            select: { imageUrl: true }
        });

    return imageUrl;
}

    async findQuestionsByBank(id: number): Promise<QuestionDto[]>{
      const questions =  this.prisma.question.findMany({
            where: {bankId: id},
        });

        return questions;
    }

    async createQuestions(bankId: number, questions: CreateQuestionDto[]) {
        const result = await this.prisma.question.createMany({
            data: questions.map(q => ({
                text: q.text,
                bankId: bankId,
            })),
            skipDuplicates: true,
        });

    return {
        message: `${result.count} questions created`,
    };
}
}