/*
  Warnings:

  - You are about to drop the column `public` on the `question-banks` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `question-banks` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "question-banks" DROP COLUMN "public",
DROP COLUMN "usageCount";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isAdmin";
