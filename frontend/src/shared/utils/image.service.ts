import { API_URL } from "../api/client";

export const getImage = (imageName: string | null | undefined) => {
  if(!imageName) return "https://placehold.net/default.png"
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }

  return `${API_URL}/uploads/${imageName}`;
};
