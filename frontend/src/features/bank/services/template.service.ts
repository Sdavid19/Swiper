import api from "../../../shared/api/client";
import { QuestionBankTemplateDto } from "../../../shared/types/generated";

export const getAllTemplates = async (): Promise<QuestionBankTemplateDto[]> => {
  const response = await api.get("/question-bank-templates");
  return response.data;
}

export const getTemplateById = async (id: number): Promise<QuestionBankTemplateDto> => {
  const response = await api.get(`/question-bank-templates/${id}`);
  return response.data;
}