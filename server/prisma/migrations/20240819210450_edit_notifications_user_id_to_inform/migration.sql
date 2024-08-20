/*
  Warnings:

  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "userId",
ADD COLUMN     "userIdToInform" INTEGER;

-- CreateIndex
CREATE INDEX "Notification_userIdToInform_idx" ON "Notification"("userIdToInform");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userIdToInform_fkey" FOREIGN KEY ("userIdToInform") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
