import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CategoryService } from '../../src/category/category.service';
import { SeedService } from '../../src/prisma/seed.service';
import { resetDb } from '../helpers/db-reset';

describe('Category integration test', () => {
    let module: TestingModule;
    let prisma: PrismaService;
    let categoryService: CategoryService;
    let seedService: SeedService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        prisma = module.get(PrismaService);
        categoryService = module.get(CategoryService);
        seedService = module.get(SeedService);

        await resetDb(prisma);

        await seedService.seedCategories([{ name: "Movies", color: "orange" }]);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should findAll() return all categories', async () => {
        const result = await categoryService.findAll();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
});