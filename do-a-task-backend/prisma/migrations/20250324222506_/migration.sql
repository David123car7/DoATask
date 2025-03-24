/*
  Warnings:

  - You are about to drop the column `contactId` on the `member` table. All the data in the column will be lost.
  - Added the required column `contactId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `member` DROP FOREIGN KEY `member_contactId_fkey`;

-- DropIndex
DROP INDEX `member_contactId_fkey` ON `member`;

-- AlterTable
ALTER TABLE `member` DROP COLUMN `contactId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `contactId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
