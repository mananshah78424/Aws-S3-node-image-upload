/*
  Warnings:

  - You are about to drop the column `postURL` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "postURL",
ADD COLUMN     "posturl" TEXT;
