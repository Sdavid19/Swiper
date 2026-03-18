import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBankDto } from "./dto";
import { BankDto } from "./dto/bank.dto";
import { BankImageDto } from "./dto/bank-image.dto";
import { UpdateBankDto } from "./dto/update-bank.dto";
import * as fs from 'fs';
import path, { extname } from "path";
import { Prisma } from "@prisma/client";

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
    
    findAll(categoryId: number | undefined, search: string | undefined): Promise<BankDto[]> {
        const where: Prisma.QuestionBankWhereInput = {};

        if(categoryId) where.categoryId = categoryId;
        if(search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
        ];
        }

        return this.prisma.questionBank.findMany({
            where,
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
            orderBy: {
                title: 'asc'
            }
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
}