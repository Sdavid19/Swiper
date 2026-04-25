import { Injectable } from "@nestjs/common";
import { loadJson } from "../../shared/files/load-json";
import { CreatePlaformDto } from "../dto/create-platform.dto";
import { CreateMediaDto } from "../dto/create-media.dto";
import { CreateMediaPlatformDto } from "../dto/create-media-platform.dto";


@Injectable()
export class MediaBackupService {
    async loadPlatformsFromFile() {
        return await loadJson<CreatePlaformDto[]>("prisma/data/platforms.json");
    }

    async loadMediaFromFile() {
        return await loadJson<CreateMediaDto[]>("prisma/data/media.json");
    }

    async loadMediaPlatformsFromFile() {
        return await loadJson<CreateMediaPlatformDto[]>("prisma/data/mediaPlatform.json");
    }
}