/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MediaGenre" DROP CONSTRAINT "MediaGenre_genreName_fkey";

-- DropForeignKey
ALTER TABLE "MediaGenre" DROP CONSTRAINT "MediaGenre_mediaId_fkey";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "MediaGenre";
