/*
  Warnings:

  - You are about to drop the column `typeId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Contact` DROP COLUMN `typeId`,
    DROP COLUMN `userId`;
