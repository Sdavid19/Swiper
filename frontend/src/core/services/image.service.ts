import { API_URL } from "../api";

export const getImage = (imageName: string) => {
    return `${API_URL}/uploads/${imageName}`;
}

