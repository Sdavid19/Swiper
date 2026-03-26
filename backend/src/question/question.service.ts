import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { updateQuestionDto } from "./dto/update-question.dto";
import { QuestionImageDto } from "./dto/question-image.dto";
import * as fs from 'fs';
import path from "path";
import sharp from "sharp";

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

    async updateQuestionImage(id: number, filename: string): Promise<QuestionImageDto | null> {
        const question = await this.prisma.question.findUnique({
            where: { id }
        });

        if (!question) {
            throw new NotFoundException(`Question with id ${id} not found`);
        }

        const uploadsDir = path.join(process.cwd(), 'uploads');
        const oldImagePath = question.imageUrl ? path.join(uploadsDir, question.imageUrl) : null;
        const newImagePath = path.join(uploadsDir, `optimized-${filename}`);

        await sharp(path.join(uploadsDir, filename))
            .resize(800)
            .jpeg({ quality: 70 })
            .toFile(newImagePath);

        fs.unlinkSync(path.join(uploadsDir, filename));

        if (oldImagePath && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        const imageUrl = await this.prisma.question.update({
            where: { id },
            data: { imageUrl: `optimized-${filename}` },
            select: { imageUrl: true }
        });

        return imageUrl;
    }


}