import { Injectable } from '@nestjs/common';

import { Show } from 'streaming-availability';
import client from '../streaming.client';

@Injectable()
export class StreamingApiService {
  async fetchPlatforms() {
    const countryCode =
      process.env.API_COUNTRY || 'hu';

    const platforms =
      await client.countriesApi.getCountry({
        countryCode,
      });

    return platforms.services;
  }

  async fetchMovies(): Promise<Show[]> {
    const countryCode =
      process.env.API_COUNTRY || 'hu';
    const platforms = await this.fetchPlatforms();

    const results = await Promise.all(
      platforms.map((p) =>
        client.showsApi.searchShowsByFilters({
          showType: 'movie',
          catalogs: [p.id],
          country: countryCode,
          orderBy: 'popularity_1week',
        }),
      ),
    );

    return results.flatMap((r) => r.shows);
  }
}
