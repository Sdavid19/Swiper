import { Injectable } from '@nestjs/common';
import { Client, Show, ShowType } from 'streaming-availability';
import { PrismaService } from '../../prisma';
import { createStreamingClient } from '../streaming.client';

@Injectable()
export class StreamingApiService {

  private client: Client | null;

  constructor(private readonly prismaService: PrismaService) {
    this.client = createStreamingClient();
  }

  async fetchPlatforms() {
    const countryCode = process.env.API_COUNTRY || 'hu';

    if (!this.client) {
      return;
    }

    const platforms = await this.client.countriesApi.getCountry({
      countryCode,
    });

    return platforms.services;
  }

  async fetchMediaByType(type: ShowType): Promise<Show[]> {
    const countryCode = process.env.API_COUNTRY || 'hu';

    if (!this.client) {
      return;
    }

    const platforms = await this.prismaService.platform.findMany();

    const results = await Promise.all(
      platforms.map((p) =>
        this.client.showsApi.searchShowsByFilters({
          showType: type,
          catalogs: [p.name],
          country: countryCode,
          orderBy: 'popularity_1week',
        }),
      ),
    );

    return results.flatMap((r) => r.shows);
  }
}