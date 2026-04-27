import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './services/media.service';
import { MediaInitService } from './services/media-init.service';
import { MediaImportService } from './services/media-import.service';
import { StreamingApiService } from './services/streaming-api.service';
import { MediaBackupService } from './services/media-backup.service';
import { MediaBootstrapService } from './services/media-bootstrap.service';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaInitService,
    MediaImportService,
    StreamingApiService,
    MediaBackupService,
    MediaBootstrapService
  ],
  exports: [
    MediaService,
    MediaInitService,
    MediaImportService,
    StreamingApiService,
    MediaBootstrapService
  ],
})
export class MediaModule { }
