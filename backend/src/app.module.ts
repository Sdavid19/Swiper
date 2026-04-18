import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category';
import { QuestioBankModule } from './question-bank/question-bank.module';
import { QuestionModule } from './question/question.module';
import { VoteModule } from './vote/vote.module';
import { MediaModule } from './media';
import { QuestioBankTemplateModule } from './question-bank-template/question-bank-template.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    CategoryModule,
    QuestioBankModule,
    QuestionModule,
    VoteModule,
    MediaModule,
    QuestioBankTemplateModule,
  ],
})
export class AppModule {}
