import { Test, TestingModule } from '@nestjs/testing';
import { QuestionBankService } from './question-bank.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaService } from '../../media/services/media.service';
import { QuestionBankTemplateService } from '../../question-bank-template/question-bank-template.service';
import { QuestionService } from '../../question/services/question.service';
import { BankState } from '../dto';
import { CategoryService } from '../../category';

describe('QuestionBankService - filters', () => {
  let service: QuestionBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionBankService,
        { provide: PrismaService, useValue: {} },
        { provide: MediaService, useValue: {} },
        { provide: QuestionBankTemplateService, useValue: {} },
        { provide: QuestionService, useValue: {} },
        { provide: CategoryService, useValue: {} },
      ],
    }).compile();

    service = module.get<QuestionBankService>(QuestionBankService);
  });

  describe('buildBankTextSearchFilter', () => {
    it('should return empty object if text is undefined', () => {
      expect(service.buildBankTextSearchFilter()).toEqual({});
    });

    it('should return empty object if text is empty', () => {
      expect(service.buildBankTextSearchFilter('')).toEqual({});
    });

    it('should return empty object if text is only spaces', () => {
      expect(service.buildBankTextSearchFilter('   ')).toEqual({});
    });

    it('should build OR filter correctly', () => {
      const result = service.buildBankTextSearchFilter('test');

      expect(result).toEqual({
        OR: [
          {
            title: {
              contains: 'test',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: 'test',
              mode: 'insensitive',
            },
          },
        ],
      });
    });
  });

  describe('buildStateFilter', () => {
    it('should return LOCKED filter', () => {
      expect(service.buildStateFilter(BankState.LOCKED)).toEqual({
        votes: { some: {} },
      });
    });

    it('should return OPEN filter', () => {
      expect(service.buildStateFilter(BankState.OPEN)).toEqual({
        votes: { none: {} },
      });
    });

    it('should return empty object for ALL', () => {
      expect(service.buildStateFilter(BankState.ALL)).toEqual({});
    });

    it('should return undefined if state is undefined', () => {
      expect(service.buildStateFilter(undefined)).toBeUndefined();
    });
  });

  describe('buildCategoryFilter', () => {
    it('should return empty object if no categories', () => {
      expect(service.buildCategoryFilter()).toEqual({});
    });

    it('should return empty object if empty array', () => {
      expect(service.buildCategoryFilter([])).toEqual({});
    });

    it('should return filter when categoryIds provided', () => {
      expect(service.buildCategoryFilter([1, 2, 3])).toEqual({
        categoryId: { in: [1, 2, 3] },
      });
    });
  });
});