import { Injectable, OnModuleInit } from '@nestjs/common';
import { MediaBootstrapService } from './media-bootstrap.service';

@Injectable()
export class MediaInitService implements OnModuleInit {
  constructor(
    private readonly bootstrapService: MediaBootstrapService,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;

    await this.bootstrapService.bootstrap();
  }
}