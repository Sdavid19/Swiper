/*
  Warnings:

  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `slug` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `color` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(7)`.
  - You are about to alter the column `imdbId` on the `media` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - The primary key for the `paltforms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `paltforms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `passwordHash` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `votes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `media-platforms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question-bank-templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question-banks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "media-platforms" DROP CONSTRAINT "media-platforms_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "media-platforms" DROP CONSTRAINT "media-platforms_platformName_fkey";

-- DropForeignKey
ALTER TABLE "question-bank-templates" DROP CONSTRAINT "question-bank-templates_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "question-banks" DROP CONSTRAINT "question-banks_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "question-banks" DROP CONSTRAINT "question-banks_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_bankId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_bankId_fkey";

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "color" SET DATA TYPE VARCHAR(7);

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "imdbId" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "paltforms" DROP CONSTRAINT "paltforms_pkey",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "paltforms_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "passwordHash" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "votes" ALTER COLUMN "title" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "media-platforms";

-- DropTable
DROP TABLE "question-bank-templates";

-- DropTable
DROP TABLE "question-banks";

-- CreateTable
CREATE TABLE "question_banks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "question_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank_templates" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "question_bank_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_platforms" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "platformName" VARCHAR(100) NOT NULL,

    CONSTRAINT "media_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "question_bank_templates_title_key" ON "question_bank_templates"("title");

-- CreateIndex
CREATE UNIQUE INDEX "media_platforms_mediaId_platformName_key" ON "media_platforms"("mediaId", "platformName");

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_banks" ADD CONSTRAINT "question_banks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "question_banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_bank_templates" ADD CONSTRAINT "question_bank_templates_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_platforms" ADD CONSTRAINT "media_platforms_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_platforms" ADD CONSTRAINT "media_platforms_platformName_fkey" FOREIGN KEY ("platformName") REFERENCES "paltforms"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
