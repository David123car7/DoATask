/*
  Warnings:

  - You are about to drop the `ContactType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Contact` DROP FOREIGN KEY `Contact_typeId_fkey`;

-- DropIndex
DROP INDEX `Contact_typeId_fkey` ON `Contact`;

-- DropTable
DROP TABLE `ContactType`;
