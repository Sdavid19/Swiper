import api from "../../../shared/api/client";
import { CategoryDto } from "../../../shared/types/generated";

export const getCategories = async (): Promise<CategoryDto[]> => {
  const response = await api.get(`/categories`);
  return response.data;
};