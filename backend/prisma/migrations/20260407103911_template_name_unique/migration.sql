/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `QuestionBankTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuestionBankTemplate_title_key" ON "QuestionBankTemplate"("title");
