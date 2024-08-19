/*
  Warnings:

  - You are about to drop the column `imageName` on the `Post` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaType` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageName",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "mediaType" TEXT NOT NULL;
