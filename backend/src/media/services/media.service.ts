import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { MediaType } from '@prisma/client';
import { CreatePlaformDto } from '../dto/create-platform.dto';
import { shuffleArray } from '../../shared/utils/shuffle';
import { CreateMediaDto } from '../dto/create-media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async findMediaByPlatforms(mediaType: MediaType, platformNames?: string[]) {
    const media = await this.prisma.media.findMany({
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

    const shuffled = shuffleArray(media);

    return shuffled.slice(0, 20);
  }

  async findAllPlatforms() {
    return this.prisma.platform.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createPlatforms(data: CreatePlaformDto[]) {
    await this.prisma.platform.createMany({
      data,
      skipDuplicates: true
    });
  }

  async createMedia(data: CreateMediaDto[]) {
    await this.prisma.media.createMany({
      data,
      skipDuplicates: true
    });
  }

  async createConnections(connections: { mediaId: number, platformName: string }[]) {
    await this.prisma.mediaPlatform.createMany({
      data: connections,
      skipDuplicates: true,
    });
  }

  async findResolvedMediaIds(imdbIds: string[]) {
    return await this.prisma.media.findMany({
      where: {
        imdbId: {
          in: imdbIds,
        },
      },
      select: { id: true, imdbId: true },
    });
  }

  async getPlatformCount() {
    return await this.prisma.platform.count();
  }

  async getMediaCount() {
    return await this.prisma.media.count();
  }
}
