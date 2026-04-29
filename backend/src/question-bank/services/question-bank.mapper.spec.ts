import { QuestionBankService } from './question-bank.service';

describe('Map bank entity to bank list item', () => {
  let service: QuestionBankService;

  beforeEach(() => {
    service = new QuestionBankService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  it('should map basic fields correctly', () => {
    const input = {
      id: 1,
      title: 'Test Bank',
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: 'img.jpg',
      category: { id: 2, name: 'Cat' },
      creator: { id: 1, name: 'User' },
      _count: { votes: 3, questions: 5 },
    };


    const result = (service as any).mapToBankListItemDto(input);

    expect(result).toMatchObject({
      id: 1,
      title: 'Test Bank',
      description: 'Desc',
      imageUrl: 'img.jpg',
      voteCount: 3,
      questionCount: 5,
    });
  });

  it('should fallback to 0 if _count is missing', () => {
    const input = {
      id: 1,
      _count: undefined,
    };

    const result = (service as any).mapToBankListItemDto(input);

    expect(result.voteCount).toBe(0);
    expect(result.questionCount).toBe(0);
  });

  it('should fallback to 0 if votes or questions missing', () => {
    const input = {
      id: 1,
      _count: {},
    };

    const result = (service as any).mapToBankListItemDto(input);

    expect(result.voteCount).toBe(0);
    expect(result.questionCount).toBe(0);
  });

  it('should pass through category and creator', () => {
    const input = {
      id: 1,
      category: { id: 2, name: 'Cat' },
      creator: { id: 3, name: 'User' },
      _count: {},
    };

    const result = (service as any).mapToBankListItemDto(input);

    expect(result.category).toEqual(input.category);
    expect(result.creator).toEqual(input.creator);
  });
});