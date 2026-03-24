import api from "../../../api/client";
import { QuestionDto } from "../../../shared/types/generated";

export const getQuestionsByBank = async (bankId: number): Promise<QuestionDto[]> => {
    const response = await api.get(`/question-banks/${bankId}/questions`);
    return response.data;
}