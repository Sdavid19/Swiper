import { Module } from '@nestjs/common';
import { VoteGateway } from './vote.gateway';
import { UserService } from '../user';
import { VoteController } from './vote.controller';
import { VoteService } from './services/vote.service';
import { RoomService } from './services/room.service';
import { QuestionBankService } from '../question-bank/question-bank.service';
import { MediaService } from '../media';
import { QuestionBankTemplateService } from '../question-bank-template/question-bank-template.service';

@Module({
  providers: [VoteGateway, VoteService, RoomService, UserService, QuestionBankService, QuestionBankTemplateService, MediaService],
  controllers: [VoteController]
})
export class VoteModule {}