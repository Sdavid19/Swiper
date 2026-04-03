import { Module } from '@nestjs/common';
import { VoteGateway } from './vote.gateway';
import { VoteService } from './vote.service';
import { UserService } from '../user';

@Module({
  providers: [VoteGateway, VoteService, UserService],
})
export class VoteModule {}