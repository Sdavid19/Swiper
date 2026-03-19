import api from "../../../api/client"
import { BankDto, BankFilterDto, BankImageDto, CreateBankDto, UpdateBankDto } from "../../../shared/types/generated"

export const getAllBanks = async (): Promise<BankDto[]> => {
  const response = await api.post("/question-banks");
  return response.data;
}

export const getAllBanksWithFilter = async (
  filter?: BankFilterDto
): Promise<BankDto[]> => {
  const response = await api.post("/question-banks", filter);
  return response.data;
}

export const getBankById = async (id: number): Promise<BankDto> => {
  const response = await api.get(`/question-banks/${id}`);
  return response.data;
}

export const createBank = async (dto: CreateBankDto): Promise<BankDto> => {
  const response = await api.post('/question-banks/create', dto);
  return response.data;
}

export const updateBank = async (id: number, dto: CreateBankDto): Promise<BankDto> => {
  const response = await api.put(`/question-banks/${id}`, dto);
  return response.data;
}

export const deleteBank = async (id: number): Promise<BankDto> => {
  const response = await api.delete(`/question-banks/${id}`);
  return response.data;
}


export const uploadBankImage = async (
  bankId: number,
  uri: string,
  type?: string,
  name?: string | null
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
    }
  );

  return response.data;
};