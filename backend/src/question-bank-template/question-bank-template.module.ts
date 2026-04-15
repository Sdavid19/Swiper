import { Module } from "@nestjs/common";
import { QuestionBankTemplateService } from "./question-bank-template.service";
import { QuestionBankTemplateController } from "./quetion-bank-template.controller";

@Module({
  controllers: [QuestionBankTemplateController],
  providers: [QuestionBankTemplateService],
  exports: [QuestionBankTemplateService]
})
export class QuestioBankTemplateModule { }