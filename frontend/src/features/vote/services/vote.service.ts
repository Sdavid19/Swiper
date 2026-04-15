import api from "@/src/api/client";
import { AnswerTopStatsDto, VoteDto } from "@/src/shared/types/generated";

export const getTopVoteStats = async (id: number): Promise<AnswerTopStatsDto> => {
  const response = await api.get(`/votes/${id}/top`);
  return response.data;
}

export const getVotesByUserParticipatedIn = async (): Promise<VoteDto[]> => {
  const response = await api.get(`/votes`);
  return response.data;
}