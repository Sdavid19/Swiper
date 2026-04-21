import { API_URL } from "../client";

export const getImage = (imageName: string) => {
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }

  return `${API_URL}/uploads/${imageName}`;
};
