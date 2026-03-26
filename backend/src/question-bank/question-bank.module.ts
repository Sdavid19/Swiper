import { Module } from "@nestjs/common";
import { QuestionBankController } from "./question-bank.controller";
import { QuestionBankService } from "./question-bank.service";
import { CategoryModule } from "../category";
import { CategoryExists } from "./validators/category-exitst.validator";
import { CategoriesExist } from "./validators/categories-exists.validator";

@Module({
  imports: [CategoryModule],
  controllers: [QuestionBankController],
  providers: [QuestionBankService, CategoryExists, CategoriesExist],
})
export class QuestioBankModule { }