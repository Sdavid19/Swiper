import api from "../../../api/client";
import { UpdateUserResponse } from "../dto/update-user-respone.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UpdateUserImageDto } from "../dto/update.user.image.dto";

export const updateUser = async (
  data: UpdateUserDto
): Promise<UpdateUserResponse> => {
  const response = await api.patch<UpdateUserResponse>("/users/profile", data);
  return response.data;
};


export const uploadUserImage = async (
  userId: number,
  uri: string,
  type?: string,
  name?: string | null
): Promise<UpdateUserImageDto> => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: type ?? "image/jpeg",
    name: name ?? "avatar.jpeg",
  } as any);

  const response = await api.post<UpdateUserImageDto>(
    `/users/upload/${userId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};