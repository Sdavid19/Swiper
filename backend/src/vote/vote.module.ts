import { Module } from '@nestjs/common';
import { VoteGateway } from './vote.gateway';
import { UserService } from '../user';
import { VoteController } from './vote.controller';
import { VoteService } from './services/vote.service';
import { RoomService } from './services/room.service';
import { QuestionBankService } from '../question-bank/services/question-bank.service';
import { MediaService } from '../media';
import { QuestionBankTemplateService } from '../question-bank-template/question-bank-template.service';
import { AuthService } from '../auth/auth.service';
import { ImageService } from '../shared/image/image.service';

@Module({
  providers: [
    VoteGateway,
    VoteService,
    RoomService,
    UserService,
    QuestionBankService,
    QuestionBankTemplateService,
    MediaService,
    AuthService,
    ImageService,
  ],
  controllers: [VoteController],
})
export class VoteModule {}
