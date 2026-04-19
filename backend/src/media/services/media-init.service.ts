import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { MediaImportService } from './media-import.service';
import { PrismaService } from '../../prisma';

@Injectable()
export class MediaInitService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly importer: MediaImportService,
  ) {}

  async onModuleInit() {
    const mediaCount =
      await this.prisma.media.count();
    const platformCount =
      await this.prisma.platform.count();

    if (platformCount === 0) {
      console.log('fetching platforms');
      await this.importer.fetchAndSavePlatforms();
    }

    if (mediaCount === 0) {
      console.log('fetching media');
      await this.importer.fetchAndSaveMovies();
    }
  }
}
