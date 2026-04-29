import api from "../../../shared/api/client";
import { CreateQuestionDto, QuestionDto, QuestionImageDto, UpdateQuestionDto } from "../../../shared/types/generated";

export const getQuestionsByBank = async (bankId: number): Promise<QuestionDto[]> => {
  const response = await api.get(`/question-banks/${bankId}/questions`);
  return response.data;
}

export const createQuestion = async (bankId: number, dto: CreateQuestionDto): Promise<QuestionDto> => {
  const response = await api.post(`/question-banks/${bankId}/questions`, dto);
  return response.data;
}

export const getQuestionById = async (id: number): Promise<QuestionDto> => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
}

export const updateQuestion = async (id: number, dto: UpdateQuestionDto): Promise<QuestionDto> => {
  const response = await api.put(`/questions/${id}`, dto);
  return response.data;
}

export const deleteQuestion = async (id: number): Promise<void> => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
}

export const uploadQuestionImage = async (
  questionId: number,
  uri: string,
  type?: string,
  name?: string | null
): Promise<QuestionImageDto> => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: type ?? "image/jpeg",
    name: name ?? "avatar.jpeg",
  } as any);

  const response = await api.post<QuestionImageDto>(
    `/questions/upload/${questionId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};