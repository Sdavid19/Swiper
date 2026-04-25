import { PrismaClient } from "@prisma/client";
import { loadJson } from "../../shared/files/load-json";

const prisma = new PrismaClient();

type CategoryInput = {
  name: string;
  color: string;
};

type TemplateInput = {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
};



async function seedCategories(categories: CategoryInput[]) {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {
        color: cat.color,
        slug: cat.name.toLowerCase(),
      },
      create: {
        name: cat.name,
        color:cat.color,
        slug: cat.name.toLowerCase(),
      },
    });
  }

  console.log("Categories seeded");
}

async function seedTemplates(templates: TemplateInput[]) {
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map(c => [c.name, c.id]));

  for (const tem of templates) {
    const categoryId = categoryMap.get(tem.category);

    if (!categoryId) {
      console.warn(`Category not found: ${tem.category}`);
      continue;
    }

    await prisma.questionBankTemplate.upsert({
      where: { title: tem.title },
      update: {
        description: tem.description,
        imageUrl: tem.imageUrl,
        categoryId,
      },
      create: {
        title: tem.title,
        description: tem.description,
        imageUrl: tem.imageUrl,
        categoryId,
      },
    });
  }

  console.log("Templates seeded");
}

async function main() {
  const categories = await loadJson<CategoryInput[]>("prisma/data/categories.json");
  const templates =  await loadJson<TemplateInput[]>("prisma/data/templates.json");

  await seedCategories(categories);
  await seedTemplates(templates);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });