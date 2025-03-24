/*
  Warnings:

  - Made the column `number` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Contact` MODIFY `number` INTEGER NOT NULL;
