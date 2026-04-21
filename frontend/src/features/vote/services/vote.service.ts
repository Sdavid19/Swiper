import api from "@/src/api/client";
import { AnswerTopStatsDto, VoteDto } from "@/src/shared/types/generated";

export const getTopVoteStats = async (id: number): Promise<AnswerTopStatsDto> => {
  const response = await api.get(`/votes/${id}/top`);
  return response.data;
}

export const getVotesByUserParticipatedIn = async (
    from?: string,
    to?: string
): Promise<VoteDto[]> => {

    const response = await api.get(`/votes`, {
        params: {
            from,
            to,
        },
    });

    return response.data;
};