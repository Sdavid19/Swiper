import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { MediaType } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findMediaByPlatforms(
    mediaType: MediaType,
    platformNames?: string[]

  ) {
    const media =
      await this.prisma.media.findMany({
        where: {
          mediaType,
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

    const shuffled = this.shuffleArray(media);

    return shuffled.slice(0, 20);
  }

  async findAllPlatforms() {
    return this.prisma.platform.findMany({
      orderBy: { name: 'asc' },
    });
  }

  shuffleArray<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1),);
      [result[i], result[j]] = [
        result[j],
        result[i],
      ];
    }

    return result;
  }
}
