/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Contact` DROP FOREIGN KEY `Contact_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `Contact` DROP FOREIGN KEY `Contact_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_communityId_fkey`;

-- DropForeignKey
ALTER TABLE `Member` DROP FOREIGN KEY `Member_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MemberTask` DROP FOREIGN KEY `MemberTask_volunteerId_fkey`;

-- DropForeignKey
ALTER TABLE `PointsMember` DROP FOREIGN KEY `PointsMember_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `Purchase` DROP FOREIGN KEY `Purchase_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCommunity` DROP FOREIGN KEY `UserCommunity_userId_fkey`;

-- DropIndex
DROP INDEX `Contact_memberId_fkey` ON `Contact`;

-- DropIndex
DROP INDEX `Contact_userId_fkey` ON `Contact`;

-- DropIndex
DROP INDEX `MemberTask_volunteerId_fkey` ON `MemberTask`;

-- DropIndex
DROP INDEX `PointsMember_memberId_fkey` ON `PointsMember`;

-- DropIndex
DROP INDEX `Purchase_memberId_fkey` ON `Purchase`;

-- DropIndex
DROP INDEX `Task_creatorId_fkey` ON `Task`;

-- DropIndex
DROP INDEX `UserCommunity_userId_fkey` ON `UserCommunity`;

-- DropTable
DROP TABLE `Member`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `addressId` INTEGER NOT NULL,
    `communityId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `totalCoins` INTEGER NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_communityId_fkey` FOREIGN KEY (`communityId`) REFERENCES `Community`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberTask` ADD CONSTRAINT `MemberTask_volunteerId_fkey` FOREIGN KEY (`volunteerId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCommunity` ADD CONSTRAINT `UserCommunity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointsMember` ADD CONSTRAINT `PointsMember_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
