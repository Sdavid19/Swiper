import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlatformDto } from './dto/platform.dto';
import { AuthGuard } from '../auth/auth.guard';
import { MediaService } from './services/media.service';

@ApiTags('media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
  ) {}

  @Get('platforms')
  @ApiOkResponse({
    type: PlatformDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  findAllPlatforms() {
    return this.mediaService.findAllPlatforms();
  }
}
