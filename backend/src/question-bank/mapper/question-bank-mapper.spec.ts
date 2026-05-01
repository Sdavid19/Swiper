import { BankWithCounts, mapToBankListItemDto } from "./question-bank-mapper";


describe('mapToBankListItemDto', () => {

  it('should map basic fields correctly', () => {
    const input = {
      id: 1,
      title: 'Test Bank',
      description: 'Desc',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      imageUrl: 'img.jpg',
      category: { id: 2, name: 'Cat' },
      creator: { id: 1, name: 'User' },
      _count: { votes: 3, questions: 5 },
    };

    const result = mapToBankListItemDto(input as BankWithCounts);

    expect(result).toEqual({
      id: 1,
      title: 'Test Bank',
      description: 'Desc',
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      imageUrl: 'img.jpg',
      category: { id: 2, name: 'Cat' },
      creator: { id: 1, name: 'User' },
      voteCount: 3,
      questionCount: 5,
    });
  });

  it('should fallback to 0 if _count is missing', () => {
    const input = {
      id: 1,
      title: 'Test',
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: null,
      category: null,
      creator: null,
    };

    const result = mapToBankListItemDto(input as any);

    expect(result.voteCount).toBe(0);
    expect(result.questionCount).toBe(0);
  });

  it('should fallback to 0 if votes or questions missing', () => {
    const input = {
      id: 1,
      title: 'Test',
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: null,
      category: null,
      creator: null,
      _count: {},
    };

    const result = mapToBankListItemDto(input as any);

    expect(result.voteCount).toBe(0);
    expect(result.questionCount).toBe(0);
  });

  it('should pass through category and creator', () => {
    const input = {
      id: 1,
      title: 'Test',
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: null,
      category: { id: 2, name: 'Cat' },
      creator: { id: 3, name: 'User' },
      _count: { votes: 0, questions: 0 },
    };

    const result = mapToBankListItemDto(input as any);

    expect(result.category).toEqual(input.category);
    expect(result.creator).toEqual(input.creator);
  });

});