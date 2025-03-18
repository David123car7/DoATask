/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`user_id`);

-- CreateTable
CREATE TABLE `Membro` (
    `Membro_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(191) NULL,
    `Data_Nasc` DATETIME(3) NULL,
    `Tot_Moedas` INTEGER NULL,
    `Contacto` VARCHAR(191) NULL,
    `MoradaMorada_ID` INTEGER NOT NULL,
    `ComunidadeComunidade_ID` INTEGER NULL,
    `UtilizadorUtilizador_ID` INTEGER NOT NULL,
    `Tot_Pontos` INTEGER NULL,

    PRIMARY KEY (`Membro_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
