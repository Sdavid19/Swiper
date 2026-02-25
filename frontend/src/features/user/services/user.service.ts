import api from "../../../core/api/client";
import { UpdateUserResponse } from "../dto/update-user-respone.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export const updateUser = async (data: UpdateUserDto): Promise<UpdateUserResponse> => {
  try {
    const response = await api.patch<UpdateUserResponse>('/users/profile', data);
    return response.data;
  } catch (error: unknown) {
    console.log('Updating data failer:', error instanceof Error ? error.message : error)
    throw error;
  }
}