import { Injectable } from '@nestjs/common';
import { StreamingApiService } from './streaming-api.service';
import { MediaType } from '@prisma/client';
import { Service, Show, ShowType } from 'streaming-availability';
import { MediaBackupService } from './media-backup.service';
import { MediaService } from './media.service';
import { CreateMediaDto } from '../dto/create-media.dto';
import { CreatePlaformDto } from '../dto/create-platform.dto';
import { CreateMediaPlatformDto } from '../dto/create-media-platform.dto';

@Injectable()
export class MediaImportService {
  constructor(
    private readonly api: StreamingApiService,
    private readonly mediaService: MediaService,
    private readonly mediaBackupService: MediaBackupService,
  ) { }

  async fetchAndSavePlatforms() {
    try {
      const platforms = await this.api.fetchPlatforms();
      await this.savePlatformsFromApi(platforms);
    } catch (err) {
      console.log('API error, loading platforms from file...');
      await this.savePlatformsFromFile();
    }
  }

  async fetchAndSaveMedia() {
    try {
      const [movies, series] = await Promise.all([
        this.api.fetchMediaByType('movie'),
        this.api.fetchMediaByType('series'),
      ]);

      const media = [...movies, ...series];

      await this.saveMedia(media);
    } catch (err) {
      console.log('API error, loading media from file...');

      await this.saveMediaFromFile();
      await this.saveConnectionsFromFile();
    }
  }

  private async saveMedia(media: Show[]) {
    if (!media.length) {
      console.log('No media found.');
      return;
    }

    console.log(`Fetched ${media.length} media.`);
    await this.saveMediaFromApi(media);
    const mediaMap = await this.buildMediaMap(media);
    await this.saveConnectionsFromApi(media, mediaMap);
    console.log('Media import finished.');
  }

  private async saveMediaFromApi(media: Show[]) {
    const mediaData: CreateMediaDto[] = media.map((m) => {
      const genres = m.genres.map((g) => g.name).join(', ');
      const overview = m.overview;

      return {
        name: m.title,
        imdbId: m.imdbId,
        description: this.buildDescription(genres, overview),
        imageUrl: m.imageSet?.verticalPoster?.w480 || null,
        mediaType: this.mapToCustomMediaType(m.showType),
      };
    });

    await this.mediaService.createMedia(mediaData);
  }

  async saveMediaFromFile() {
    const media = await this.mediaBackupService.loadMediaFromFile();
    await this.mediaService.createMedia(media);
  }

  private async savePlatformsFromApi(platforms: Service[]) {
    const data: CreatePlaformDto[] = platforms.map((p) => ({
      name: p.id,
      imageUrl: p.imageSet.lightThemeImage,
    }));

    await this.mediaService.createPlatforms(data);
  }

  async savePlatformsFromFile() {
    const platforms = await this.mediaBackupService.loadPlatformsFromFile();
    await this.mediaService.createPlatforms(platforms);
  }

  private async saveConnectionsFromApi(media: Show[], mediaMap: Map<string, number>) {
    const connections = this.buildConnections(media, mediaMap);

    if (connections.length) {
      await this.mediaService.createConnections(connections);
      console.log(`Saved ${connections.length} media-platform connections.`,);
    }
  }

  async saveConnectionsFromFile() {
    const connections = await this.mediaBackupService.loadMediaPlatformsFromFile();
    await this.mediaService.createConnections(connections);
  }

  private buildConnections(media: Show[], mediaMap: Map<string, number>) {
    const connections: CreateMediaPlatformDto[] = [];

    for (const m of media) {
      const mediaId = mediaMap.get(m.imdbId);
      if (!mediaId) continue;

      for (const option of m.streamingOptions['hu'] || []) {
        if (option.service?.id) {
          connections.push({ mediaId, platformName: option.service.id });
        }
      }
    }

    return connections;
  }

  private async buildMediaMap(media: Show[]) {
    const imdbIds = media.map((m) => m.imdbId).filter(Boolean);
    const resolvedMedia = await this.mediaService.findResolvedMediaIds(imdbIds);

    return new Map(resolvedMedia.map((m) => [m.imdbId, m.id]));
  }

  buildDescription(genres: string, overview: string) {
    if (!genres && !overview) return null;

    return `${genres ? genres : ''}${genres && overview ? '\n' : ''}${overview || ''}`;
  }

  mapToCustomMediaType(t: ShowType) {
    if (t === 'movie') return MediaType.MOVIE;
    if (t === 'series') return MediaType.SERIES;

    return MediaType.MOVIE;
  }
}