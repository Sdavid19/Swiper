import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'categories.json');
  const categories: { name: string; color: string }[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { color: cat.color },
      create: { name: cat.name, color: cat.color, slug: cat.name.toLowerCase() },
    });
  }

  console.log('✅ Categories seeded successfully');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());