import { BankDto, BankListItemDto } from "../dto";

export interface BankWithCounts extends BankDto {
  _count: {questions: number, votes: number}
}  
  
  export function mapToBankListItemDto(bank: BankWithCounts): BankListItemDto {
    return {
      id: bank.id,
      title: bank.title,
      category: bank.category,
      description: bank.description,
      createdAt: bank.createdAt,
      imageUrl: bank.imageUrl,
      updatedAt: bank.updatedAt,
      voteCount: bank._count?.votes ?? 0,
      questionCount: bank._count?.questions ?? 0,
      creator: bank.creator,
    };
  }