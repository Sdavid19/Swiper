import { API_URL } from "../client"; 

export const getImage = (imageName: string) => {
    return `${API_URL}/uploads/${imageName}`;
}

