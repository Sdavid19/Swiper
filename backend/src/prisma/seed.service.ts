import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) { }

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const categoryCount = await this.prisma.category.count();

    if (categoryCount > 0) {
      return;
    }

    console.log('Empty database, seeding started.');

    await this.seed();

    console.log('Seed completed');
  }

  async seed() {
    const filePathCategory = path.join(process.cwd(), 'prisma/data/categories.json');
    const filePathTemplate = path.join(process.cwd(), 'prisma/data/templates.json');

    const categories: { name: string; color: string }[] =
      JSON.parse(fs.readFileSync(filePathCategory, 'utf-8'));

    const templates: {
      title: string;
      description: string;
      category: string;
      imageUrl: string;
    }[] = JSON.parse(fs.readFileSync(filePathTemplate, 'utf-8'));

    await this.seedCategories(categories);
    await this.seedTemplates(templates);
  }

  async seedCategories(categories: { name: string; color: string }[]) {
    for (const cat of categories) {
      await this.prisma.category.upsert({
        where: { name: cat.name },
        update: { color: cat.color },
        create: {
          name: cat.name,
          color: cat.color,
          slug: cat.name.toLowerCase(),
        },
      });
    }

    console.log('Categories seeded');
  }

  async seedTemplates(
    templates: {
      title: string;
      description: string;
      category: string;
      imageUrl: string;
    }[],
  ) {
    for (const tem of templates) {
      const category = await this.prisma.category.findUnique({
        where: { name: tem.category },
      });

      if (!category) {
        console.warn(`Category not found: ${tem.category}`);
        continue;
      }

      await this.prisma.questionBankTemplate.upsert({
        where: { title: tem.title },
        update: {
          description: tem.description,
          imageUrl: tem.imageUrl,
          categoryId: category.id,
        },
        create: {
          title: tem.title,
          description: tem.description,
          imageUrl: tem.imageUrl,
          categoryId: category.id,
        },
      });
    }

    console.log('Templates seeded');
  }
}