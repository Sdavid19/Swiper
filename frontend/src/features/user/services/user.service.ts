import api, { API_URL } from "../../../core/api/client";
import { UpdateUserResponse } from "../dto/update-user-respone.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UpdateUserImageDto } from "../dto/update.user.image.dto";

export const updateUser = async (data: UpdateUserDto): Promise<UpdateUserResponse> => {
  try {
    const response = await api.patch<UpdateUserResponse>('/users/profile', data);
    return response.data;
  } catch (error: unknown) {
    console.log('Updating data failer:', error instanceof Error ? error.message : error)
    throw error;
  }
}

export const uploadUserImage = async (userId: number, uri: string, type: string | undefined, name: string | undefined | null): Promise<UpdateUserImageDto> => {
  try {
    const formData = new FormData();
    formData.append('file', {
        uri: uri,
        type: type || 'image/jpeg',
        name: name ?? 'avatar.jpeg',
    } as any);

     const response = await api.post<UpdateUserImageDto>(`/users/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.log('Image upload failed:', error instanceof Error ? error.message : error)
    throw error
  }
}
