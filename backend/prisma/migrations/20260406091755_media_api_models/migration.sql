/*
  Warnings:

  - You are about to drop the column `platform` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imdbId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imdbId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaType` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "platform",
DROP COLUMN "type",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "imdbId" TEXT NOT NULL,
ADD COLUMN     "mediaType" "MediaType" NOT NULL;

-- DropEnum
DROP TYPE "MediaPlatform";

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaGenre" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "MediaGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaPlatform" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,

    CONSTRAINT "MediaPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MediaGenre_mediaId_genreId_key" ON "MediaGenre"("mediaId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MediaPlatform_mediaId_platformId_key" ON "MediaPlatform"("mediaId", "platformId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_imdbId_key" ON "Media"("imdbId");

-- AddForeignKey
ALTER TABLE "MediaGenre" ADD CONSTRAINT "MediaGenre_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaGenre" ADD CONSTRAINT "MediaGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaPlatform" ADD CONSTRAINT "MediaPlatform_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaPlatform" ADD CONSTRAINT "MediaPlatform_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
