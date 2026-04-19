import { Injectable } from '@nestjs/common';
import { StreamingApiService } from './streaming-api.service';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../../prisma';

@Injectable()
export class MediaImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly api: StreamingApiService,
  ) {}

  async fetchAndSavePlatforms() {
    const platforms =
      await this.api.fetchPlatforms();

    await this.prisma.platform.createMany({
      data: platforms.map((p) => ({
        name: p.id,
        imageUrl: p.imageSet.lightThemeImage,
      })),
      skipDuplicates: true,
    });
  }

  async fetchAndSaveMovies() {
    console.log('Starting to fetch movies...');

    const media = await this.api.fetchMovies();

    if (media.length === 0) {
      console.log('No movies found.');
      return;
    }

    console.log(
      `Fetched ${media.length} movies. Saving...`,
    );

    const platformNames = [
      ...new Set(
        media.flatMap(
          (m) =>
            m.streamingOptions['hu']?.map(
              (opt) => opt.service.id,
            ) || [],
        ),
      ),
    ];

    if (platformNames.length > 0) {
      await this.prisma.platform.createMany({
        data: platformNames.map((name) => ({
          name,
        })),
        skipDuplicates: true,
      });
    }

    const mediaData = media.map((m) => ({
      name: m.title,
      imdbId: m.imdbId,
      imageUrl:
        m.imageSet?.verticalPoster?.w480 || null,
      mediaType: MediaType.MOVIE,
    }));

    await this.prisma.media.createMany({
      data: mediaData,
      skipDuplicates: true,
    });

    const createdMedias =
      await this.prisma.media.findMany({
        where: {
          imdbId: {
            in: media
              .map((m) => m.imdbId)
              .filter(Boolean),
          },
        },
        select: { id: true, imdbId: true },
      });

    const mediaMap = new Map(
      createdMedias.map((m) => [m.imdbId, m.id]),
    );

    const connections: {
      mediaId: number;
      platformName: string;
    }[] = [];

    for (const m of media) {
      const mediaId = mediaMap.get(m.imdbId);
      if (!mediaId) continue;

      for (const option of m.streamingOptions[
        'hu'
      ] || []) {
        if (option.service?.id) {
          connections.push({
            mediaId,
            platformName: option.service.id,
          });
        }
      }
    }

    if (connections.length > 0) {
      await this.prisma.mediaPlatform.createMany({
        data: connections,
        skipDuplicates: true,
      });

      console.log(
        `Saved ${connections.length} media-platform connections.`,
      );
    }

    console.log('Movies import finished.');
  }
}
