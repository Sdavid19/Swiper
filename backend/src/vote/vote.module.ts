import { Module } from '@nestjs/common';
import { VoteGateway } from './vote.gateway';
import { VoteController } from './vote.controller';
import { VoteService } from './services/vote.service';
import { RoomService } from './services/room.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { QuestionModule } from '../question/question.module';
import { MediaModule } from '../media';
import { QuestioBankModule } from '../question-bank/question-bank.module';
import { QuestioBankTemplateModule } from '../question-bank-template/question-bank-template.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    QuestionModule,
    QuestioBankModule,
    QuestioBankTemplateModule,
    MediaModule,
  ],
  providers: [
    VoteGateway,
    VoteService,
    RoomService,
  ],
  controllers: [VoteController],
})
export class VoteModule {}