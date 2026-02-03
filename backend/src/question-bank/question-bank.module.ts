import { Module } from "@nestjs/common";
import { QuestionBankController } from "./question-bank.controller";
import { QuestionBankService } from "./question-bank.service";
import { CategoryModule } from "../category";
import { CategoryExists } from "./validators/category-exitst.validator";

@Module({
  imports: [CategoryModule],
  controllers: [QuestionBankController],
  providers: [QuestionBankService, CategoryExists],
})
export class QuestioBankModule {}