import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBankDto } from "./dto/create-bank.dto";
import { BankDto } from "./dto/bank.dto";
import { BankImageDto } from "./dto/bank-image.dto";
import { UpdateBankDto } from "./dto/update-bank.dto";
import * as fs from 'fs';
import path from "path";
import { CreateQuestionDto } from "../question/dto/create-question.dto";
import { QuestionDto } from "../question/dto/question.dto";
import sharp from "sharp";
import { MediaService } from "../media";
import { CreateMediaQuestionDto } from "../question/dto/create-media-question.dto";

@Injectable()
export class QuestionBankService {
    constructor(private readonly prisma: PrismaService, private readonly mediaService: MediaService) { }

    async findById(id: number) {
        return this.prisma.questionBank.findUnique({
            where: { id: id },
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

    update(id: number, dto: UpdateBankDto): Promise<BankDto> {
        return this.prisma.questionBank.update({
            where: { id },
            data: { ...dto },
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
            data: { ...dto },
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
    const bank = await this.prisma.questionBank.findUnique({
        where: { id },
        select: {
            id: true,
            _count: {
                select: { questions: true }
            }
        }
    });

    if (!bank) {
        throw new NotFoundException(`Questionbank with id ${id} not found`);
    }

    if (bank._count.questions > 0) {
        throw new BadRequestException("Only empty banks can be deleted!");
    }

    return this.prisma.questionBank.delete({
        where: { id },
        select: { id: true }
    });
}


    async updateBankImage(id: number, filename: string): Promise<BankImageDto | null> {
        const bank = await this.prisma.questionBank.findUnique({
            where: { id }
        });

        if (!bank) {
            throw new NotFoundException(`Question with id ${id} not found`);
        }

        const uploadsDir = path.join(process.cwd(), 'uploads');
        const oldImagePath = bank.imageUrl ? path.join(uploadsDir, bank.imageUrl) : null;
        const newImagePath = path.join(uploadsDir, `optimized-${filename}`);

        await sharp(path.join(uploadsDir, filename))
            .resize(800)
            .jpeg({ quality: 70 })
            .toFile(newImagePath);

        fs.unlinkSync(path.join(uploadsDir, filename));

        if (oldImagePath && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        const imageUrl = await this.prisma.questionBank.update({
            where: { id },
            data: { imageUrl: `optimized-${filename}` },
            select: { imageUrl: true }
        });

        return imageUrl;
    }

    async findQuestionsByBank(id: number): Promise<QuestionDto[]> {
        const questions = await this.prisma.question.findMany({
            where: { bankId: id },
        });

        return questions;
    }

    async createQuestion(id: number, dto: CreateQuestionDto) {
        const result = await this.prisma.question.create({
            data: {
                bankId: id,
                text: dto.text
            }
        });

        return result;
    }

    async createQuestions(bankId: number, dtos: CreateMediaQuestionDto[]) {
        await this.prisma.question.createMany({
            data: dtos.map(dto => ({
                bankId,
                text: dto.text,
                imageUrl: dto.imageUrl
            })),
            skipDuplicates: true
        });
    }

    async createQuestionBankByMedia(platformNames: string[] | undefined, userId: number){
        const media = await this.mediaService.findMediaByPlatforms(platformNames);

        const category = await this.prisma.category.findFirst({where: {name: {contains: 'movie'}}});

        if(!category) throw new NotFoundException("Category 'Movie' not found!");

        //Bank létrehozása
        const bank = await this.prisma.questionBank.create({
            data: {
                title: 'Movies of the week',
                description: 'Find all the movies of the week at one place!',
                categoryId: category.id,
                imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                creatorId: userId
            } 
        })

        //Kérdések hozzáadása a filmek alapján
        await this.createQuestions(bank.id, media.map(m => ({text: m.name, imageUrl: m.imageUrl})));

        return bank;
    }
}