/*
  Warnings:

  - You are about to drop the column `memberId` on the `Contact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Contact` DROP FOREIGN KEY `Contact_memberId_fkey`;

-- DropIndex
DROP INDEX `Contact_memberId_fkey` ON `Contact`;

-- AlterTable
ALTER TABLE `Contact` DROP COLUMN `memberId`;

-- AlterTable
ALTER TABLE `member` ADD COLUMN `contactId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
