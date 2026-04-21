"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new client_1.PrismaClient();
async function main() {
    const filePathCategory = path.join(__dirname, 'categories.json');
    const filePathTemplate = path.join(__dirname, 'templates.json');
    const categories = JSON.parse(fs.readFileSync(filePathCategory, 'utf-8'));
    const templates = JSON.parse(fs.readFileSync(filePathTemplate, 'utf-8'));
    await seedCategories(categories);
    await seedTemplates(templates);
}
async function seedCategories(categories) {
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: { color: cat.color },
            create: { name: cat.name, color: cat.color, slug: cat.name.toLowerCase() },
        });
    }
    console.log('Categories seeded successfully');
}
async function seedTemplates(templates) {
    for (const tem of templates) {
        const category = await prisma.category.findUnique({
            where: { name: tem.category }
        });
        if (!category) {
            console.warn(`Category not found: ${tem.category}`);
            continue;
        }
        await prisma.questionBankTemplate.upsert({
            where: { title: tem.title },
            update: {
                description: tem.description,
                imageUrl: tem.imageUrl,
                categoryId: category.id
            },
            create: {
                title: tem.title,
                description: tem.description,
                imageUrl: tem.imageUrl,
                categoryId: category.id
            }
        });
    }
    console.log('Templates seeded successfully');
}
main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map