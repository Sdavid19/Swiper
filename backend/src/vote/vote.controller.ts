import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { VoteService } from './services/vote.service';
import { JwtPayload } from '../auth/interfaces';
import { AnswerTopStatsDto } from './dto/answer-top-stats.dto';
import { VoteDto } from './dto/vote.dto';
import { VoteDetailsDto } from './dto/vote-details.dto';
import { VoteFilterDto } from './dto/vote-filter.dto';

@ApiTags('votes')
@ApiBearerAuth()
@Controller('votes')
export class VoteController {
  constructor(
    private readonly voteService: VoteService,
  ) { }


  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VoteDto, isArray: true })
  getVotesUserParticipatedIn(
    @Request() req: { user: JwtPayload },
    @Query() filter: VoteFilterDto,
  ) {
    return this.voteService.getAllVotesUserParticipatedIn(
      req.user.sub,
      filter,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VoteDetailsDto })
  getVoteById(@Param('id') id: string) {
    return this.voteService.getVoteById(+id);
  }

  @Get(':id/top')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AnswerTopStatsDto })
  getTopStat(
    @Request() req: { user: JwtPayload },
    @Param('id') id: string,
  ) {
    return this.voteService.getTopStats(+id);
  }
}
