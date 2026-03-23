import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CategoryDto, CreateCategoryDto } from "./dto";

@Injectable()
export class CategoryService { 
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number) {
        return this.prisma.category.findUnique({where: {id: id}})
    }

      create(dto: CreateCategoryDto): Promise<CategoryDto> { 
        const newCategory = this.prisma.category.create({
            data: {
                name: dto.name,
                slug: dto.name.toLowerCase()
            }
        });

        return newCategory;
    }

    findAll(): Promise<CategoryDto[]> {
        return this.prisma.category.findMany({orderBy: { name: 'asc' }});
    }

    async delete(id: number) {
        const category = await this.findById(id);

        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        return this.prisma.category.delete({
            where: { id },
            select: {id: true}
         });
    }
}