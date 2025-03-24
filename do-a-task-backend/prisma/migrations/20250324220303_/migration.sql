/*
  Warnings:

  - Made the column `contactId` on table `member` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `member` DROP FOREIGN KEY `member_contactId_fkey`;

-- DropIndex
DROP INDEX `member_contactId_fkey` ON `member`;

-- AlterTable
ALTER TABLE `member` MODIFY `contactId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
