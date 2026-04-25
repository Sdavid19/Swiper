import { MediaType } from "@prisma/client";

export class CreateMediaDto {
    name: string;
    description: string;
    imdbId: string;
    mediaType: MediaType;
    imageUrl: string | null;
}