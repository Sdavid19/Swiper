/*
  Warnings:

  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Genre` table. All the data in the column will be lost.
  - The primary key for the `MediaGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `genreId` on the `MediaGenre` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `MediaGenre` table. All the data in the column will be lost.
  - You are about to drop the column `platformId` on the `MediaPlatform` table. All the data in the column will be lost.
  - The primary key for the `Platform` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Platform` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId,platformName]` on the table `MediaPlatform` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `genreName` to the `MediaGenre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformName` to the `MediaPlatform` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MediaGenre" DROP CONSTRAINT "MediaGenre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "MediaPlatform" DROP CONSTRAINT "MediaPlatform_platformId_fkey";

-- DropIndex
DROP INDEX "Genre_name_key";

-- DropIndex
DROP INDEX "MediaGenre_mediaId_genreId_key";

-- DropIndex
DROP INDEX "MediaPlatform_mediaId_platformId_key";

-- DropIndex
DROP INDEX "Platform_name_key";

-- AlterTable
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Genre_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "MediaGenre" DROP CONSTRAINT "MediaGenre_pkey",
DROP COLUMN "genreId",
DROP COLUMN "id",
ADD COLUMN     "genreName" TEXT NOT NULL,
ADD CONSTRAINT "MediaGenre_pkey" PRIMARY KEY ("mediaId", "genreName");

-- AlterTable
ALTER TABLE "MediaPlatform" DROP COLUMN "platformId",
ADD COLUMN     "platformName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Platform" DROP CONSTRAINT "Platform_pkey",
DROP COLUMN "id",
ADD COLUMN     "imageUrl" TEXT,
ADD CONSTRAINT "Platform_pkey" PRIMARY KEY ("name");

-- CreateIndex
CREATE UNIQUE INDEX "MediaPlatform_mediaId_platformName_key" ON "MediaPlatform"("mediaId", "platformName");

-- AddForeignKey
ALTER TABLE "MediaGenre" ADD CONSTRAINT "MediaGenre_genreName_fkey" FOREIGN KEY ("genreName") REFERENCES "Genre"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaPlatform" ADD CONSTRAINT "MediaPlatform_platformName_fkey" FOREIGN KEY ("platformName") REFERENCES "Platform"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
