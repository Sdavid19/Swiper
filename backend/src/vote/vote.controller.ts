import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { VoteService } from './services/vote.service';
import { JwtPayload } from '../auth/interfaces';
import { AnswerTopStatsDto, VoteDto, VoteDetailsDto, VoteFilterDto } from './dto';
import { VoteListDto } from './dto/vote-list.dto';

@ApiTags('votes')
@ApiBearerAuth()
@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService,) { }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VoteListDto})
  getVotesUserParticipatedIn(@Request() req: { user: JwtPayload }, @Body() filter: VoteFilterDto) {
    const { categoryIds, date, limit, page, text } = filter;

    return this.voteService.findAllVotesUserParticipatedIn(
      req.user.sub,
      new Date(date), text, page, limit, categoryIds
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: VoteDetailsDto })
  getVoteById(@Param('id') id: string) {
    return this.voteService.getVoteById(+id);
  }

  @Get(':id/stat')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AnswerTopStatsDto })
  getTopStat(@Request() req: { user: JwtPayload }, @Param('id') id: string,) {
    return this.voteService.getStats(+id, req.user.sub);
  }
}
