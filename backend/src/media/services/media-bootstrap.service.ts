import { Injectable } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaImportService } from './media-import.service';

@Injectable()
export class MediaBootstrapService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly importer: MediaImportService,
  ) {}

  private hasApiKey() {
    return !!process.env.RAPID_API_KEY;
  }

  async bootstrap() {
    const platformCount = await this.mediaService.getPlatformCount();
    const mediaCount = await this.mediaService.getMediaCount();

    if (platformCount === 0) {
      if (this.hasApiKey()) {
        console.log('fetching platforms');
        await this.importer.fetchAndSavePlatforms();
      } else {
        console.log('No API key, loading platforms from files');
        await this.importer.savePlatformsFromFile();
      }
    }

    if (mediaCount === 0) {
      if (this.hasApiKey()) {
        console.log('fetching media');
        await this.importer.fetchAndSaveMedia();
      } else {
        console.log('No API key, loading media from files');
        await this.importer.saveMediaFromFile();
        await this.importer.saveConnectionsFromFile();
      }
    }
  }
}