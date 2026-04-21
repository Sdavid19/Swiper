import { Module } from '@nestjs/common';
import { VoteGateway } from './vote.gateway';
import { UserService } from '../user';
import { VoteController } from './vote.controller';
import { VoteService } from './services/vote.service';
import { RoomService } from './services/room.service';
import { QuestionBankService } from '../question-bank/services/question-bank.service';
import { QuestionBankTemplateService } from '../question-bank-template/question-bank-template.service';
import { AuthService } from '../auth/auth.service';
import { ImageService } from '../shared/image/image.service';
import { QuestionService } from '../question/services/question.service';
import { MediaService } from '../media/services/media.service';

@Module({
  providers: [
    VoteGateway,
    VoteService,
    RoomService,
    UserService,
    QuestionService,
    QuestionBankService,
    QuestionBankTemplateService,
    MediaService,
    AuthService,
    ImageService,
  ],
  controllers: [VoteController],
})
export class VoteModule {}
