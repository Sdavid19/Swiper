import api from "../../../api/client";
import {
  BankDetailDto,
  BankDto,
  BankFilterDto,
  BankImageDto,
  BankListDto,
  BankListItemDto,
  CreateBankDto,
  CreateMediaBankDto,
} from "../../../shared/types/generated";

export const getAllBanks = async (): Promise<BankDto[]> => {
  const response = await api.post("/question-banks");
  return response.data;
};

export const getAllBanksWithFilter = async (
  filter?: BankFilterDto,
): Promise<BankListDto> => {
  const response = await api.post("/question-banks", filter);
  return response.data;
};

export const getTopBanks = async (): Promise<BankListItemDto[]> => {
  const response = await api.get("/question-banks/top");
  return response.data;
};

export const getBankById = async (id: number): Promise<BankListItemDto> => {
  const response = await api.get(`/question-banks/${id}`);
  return response.data;
};

export const getBankWithQuestionsById = async (
  id: number,
): Promise<BankDetailDto> => {
  const response = await api.get(`/question-banks/${id}/details`);
  return response.data;
};

export const createBank = async (dto: CreateBankDto): Promise<BankListItemDto> => {
  const response = await api.post("/question-banks/create", dto);
  return response.data;
};

export const copyBank = async (id: number): Promise<BankDto> => {
  const response = await api.post(`/question-banks/${id}/copy`);
  return response.data;
};

export const createBankByMedia = async (
  dto: CreateMediaBankDto,
): Promise<BankListItemDto> => {
  const response = await api.post("/question-banks/create-media", dto);
  return response.data;
};

export const updateBank = async (
  id: number,
  dto: CreateBankDto,
): Promise<BankListItemDto> => {
  const response = await api.put(`/question-banks/${id}`, dto);
  return response.data;
};

export const deleteBank = async (id: number): Promise<BankDto> => {
  const response = await api.delete(`/question-banks/${id}`);
  return response.data;
};

export const uploadBankImage = async (
  bankId: number,
  uri: string,
  type?: string,
  name?: string | null,
): Promise<BankImageDto> => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: type ?? "image/jpeg",
    name: name ?? "avatar.jpeg",
  } as any);

  const response = await api.post<BankImageDto>(
    `/question-banks/upload/${bankId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
