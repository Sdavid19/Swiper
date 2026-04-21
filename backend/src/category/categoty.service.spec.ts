import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;

  const mockPrisma = {
    category: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          CategoryService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
        ],
      }).compile();

    service = module.get<CategoryService>(
      CategoryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find category by id', async () => {
    const category = {
      id: 1,
      name: 'Test',
      slug: 'test',
    };

    mockPrisma.category.findUnique.mockResolvedValue(
      category,
    );

    const result = await service.findById(1);

    expect(result).toBe(category);
    expect(
      mockPrisma.category.findUnique,
    ).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });


  it('should create category with slug', async () => {
    const dto = { name: 'Test Category' };

    const created = {
      id: 1,
      name: dto.name,
      slug: 'test category',
    };

    mockPrisma.category.create.mockResolvedValue(
      created,
    );

    const result = await service.create(
      dto as any,
    );

    expect(result).toBe(created);
    expect(
      mockPrisma.category.create,
    ).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        slug: dto.name.toLowerCase(),
      },
    });
  });


  it('should return all categories sorted by name', async () => {
    const categories = [
      { id: 1, name: 'A', slug: 'a' },
      { id: 2, name: 'B', slug: 'b' },
    ];

    mockPrisma.category.findMany.mockResolvedValue(
      categories,
    );

    const result = await service.findAll();

    expect(result).toBe(categories);
    expect(
      mockPrisma.category.findMany,
    ).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });


  it('should delete category if exists', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(
      {
        id: 1,
        name: 'Test',
      },
    );

    mockPrisma.category.delete.mockResolvedValue({
      id: 1,
    });

    const result = await service.delete(1);

    expect(result).toEqual({ id: 1 });
    expect(
      mockPrisma.category.delete,
    ).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true },
    });
  });

  it('should throw NotFoundException if category does not exist', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(
      null,
    );

    await expect(
      service.delete(1),
    ).rejects.toThrow(NotFoundException);

    expect(
      mockPrisma.category.delete,
    ).not.toHaveBeenCalled();
  });
});
