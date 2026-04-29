import api from "../../../shared/api/client";
import { PlatformDto } from "../../../shared/types/generated";

export const getAllPlatforms = async (): Promise<PlatformDto[]> => {
  const response = await api.get("/media/platforms");
  return response.data;
}
