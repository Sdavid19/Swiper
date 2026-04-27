import { Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto, CreateCategoryDto, } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService,) { }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    return category;
  }

  async create(dto: CreateCategoryDto,): Promise<CategoryDto> {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: this.generateSlug(dto.name),
      },
    });
  }

  findAll(): Promise<CategoryDto[]> {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async delete(id: number) {
    const category = await this.findById(id);

    if(!category) throw new NotFoundException(`Category with id ${id} not exists`)

    return this.prisma.category.delete({
      where: { id },
      select: { id: true },
    });
  }

  private generateSlug(name: string): string {
    return name.trim().toLowerCase();
  }
}
