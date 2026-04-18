import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import client from './streaming.client';
import { Show } from 'streaming-availability';
import { MediaType } from '@prisma/client';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findMediaByPlatforms(
    platformNames?: string[],
  ) {
    const media =
      await this.prisma.media.findMany({
        where: {
          ...(platformNames &&
          platformNames.length > 0
            ? {
                platforms: {
                  some: {
                    platform: {
                      name: { in: platformNames },
                    },
                  },
                },
              }
            : {}),
        },
        take: 200,
      });

    const shuffled = media.sort(
      () => Math.random() - 0.5,
    );

    return shuffled.slice(0, 20);
  }

  async findAllPlatforms() {
    return this.prisma.platform.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async onModuleInit() {
    const mediaCount =
      await this.prisma.media.count();
    const platofrmCount =
      await this.prisma.platform.count();

    if (platofrmCount == 0) {
      console.log('fetching platforms');
      await this.fetchAndSavePlatforms();
    }
    if (mediaCount == 0) {
      console.log('fethcing media');
      await this.fetchAndSaveMovies();
    }
  }

  async fetchPlatforms() {
    const countryCode =
      process.env.API_COUNTRY || 'hu';
    const platforms =
      await client.countriesApi.getCountry({
        countryCode,
      });
    return platforms.services;
  }

  async fetchMovies() {
    const countryCode =
      process.env.API_COUNTRY || 'hu';
    const platforms = await this.fetchPlatforms();

    const mediaToSave: Show[] = [];

    for (const p of platforms) {
      const showsByCurrentPlatform =
        await client.showsApi.searchShowsByFilters(
          {
            showType: 'movie',
            catalogs: [p.id],
            country: countryCode,
            orderBy: 'popularity_1week',
          },
        );
      mediaToSave.push(
        ...showsByCurrentPlatform.shows,
      );
    }
    return mediaToSave;
  }

  async fetchAndSaveMovies() {
    console.log('Starting to fetch movies...');

    const media = await this.fetchMovies();

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

  async fetchAndSavePlatforms() {
    const platforms = await this.fetchPlatforms();
    const services = platforms;

    await this.prisma.platform.createMany({
      data: services.map((p) => ({
        name: p.id,
        imageUrl: p.imageSet.lightThemeImage,
      })),
      skipDuplicates: true,
    });
  }
}
