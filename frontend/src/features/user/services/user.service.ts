import api from "../../../shared/api/client";
import { UpdateUserDto, UserImageDto } from "../../../shared/types/generated";

export const updateUser = async (
  data: UpdateUserDto
): Promise<UpdateUserDto> => {
  const response = await api.patch<UpdateUserDto>("/users/profile", data);
  return response.data;
};


export const uploadUserImage = async (
  userId: number,
  uri: string,
  type?: string,
  name?: string | null
): Promise<UserImageDto> => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: type ?? "image/jpeg",
    name: name ?? "avatar.jpeg",
  } as any);

  const response = await api.post<UserImageDto>(
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