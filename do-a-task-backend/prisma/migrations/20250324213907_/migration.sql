-- DropForeignKey
ALTER TABLE `Contact` DROP FOREIGN KEY `Contact_userId_fkey`;

-- DropIndex
DROP INDEX `Contact_userId_fkey` ON `Contact`;
