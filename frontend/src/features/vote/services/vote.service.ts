import api from "@/src/shared/api/client";
import { AnswerTopStatsDto, VoteFilterDto, VoteListDto } from "@/src/shared/types/generated";

export const getTopVoteStats = async (id: number): Promise<AnswerTopStatsDto> => {
    const response = await api.get(`/votes/${id}/stat`);
    return response.data;
}

export const getVotesByUserParticipatedIn = async (filter: VoteFilterDto): Promise<VoteListDto> => {
    const response = await api.post(`/votes`, filter);
    return response.data;
};