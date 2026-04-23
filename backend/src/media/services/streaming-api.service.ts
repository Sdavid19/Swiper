import { Injectable } from '@nestjs/common';

import { Show } from 'streaming-availability';
import client from '../streaming.client';
import { PrismaService } from '../../prisma';

@Injectable()
export class StreamingApiService {

  constructor(private readonly prismaService: PrismaService) {}

  async fetchPlatforms() {
    const countryCode = process.env.API_COUNTRY || 'hu';

    const platforms =
      await client.countriesApi.getCountry({
        countryCode,
      });

    return platforms.services;
  }

  async fetchMovies(): Promise<Show[]> {
    const countryCode = process.env.API_COUNTRY || 'hu';
    const platforms = await this.prismaService.platform.findMany();

    const results = await Promise.all(
      platforms.map((p) =>
        client.showsApi.searchShowsByFilters({
          showType: 'movie',
          catalogs: [p.name],
          country: countryCode,
          orderBy: 'popularity_1week',
        }),
      ),
    );

    return results.flatMap((r) => r.shows);
  }

  async fetchSeries(): Promise<Show[]> {
    const countryCode =
      process.env.API_COUNTRY || 'hu';
    const platforms = await this.prismaService.platform.findMany();

    const results = await Promise.all(
      platforms.map((p) =>
        client.showsApi.searchShowsByFilters({
          showType: 'series',
          catalogs: [p.name],
          country: countryCode,
          orderBy: 'popularity_1week',
        }),
      ),
    );

    return results.flatMap((r) => r.shows);
  }
}
