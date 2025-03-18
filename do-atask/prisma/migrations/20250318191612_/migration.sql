/*
  Warnings:

  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Membro` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`;

-- DropTable
DROP TABLE `Membro`;

-- CreateTable
CREATE TABLE `member` (
    `member_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `dateBirth` DATETIME(3) NULL,
    `tot_coins` INTEGER NULL,
    `contact` VARCHAR(191) NULL,
    `tot_points` INTEGER NULL,

    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
