/*
  Warnings:

  - The primary key for the `emirate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `emirate` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `emirate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `region` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `emirate_id` on the `region` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `region_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `region` DROP FOREIGN KEY `Region_emirate_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_region_id_fkey`;

-- DropIndex
DROP INDEX `Region_emirate_id_fkey` ON `region`;

-- DropIndex
DROP INDEX `User_region_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `emirate` DROP PRIMARY KEY,
    DROP COLUMN `name`,
    ADD COLUMN `name_ar` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `name_en` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `region` DROP PRIMARY KEY,
    ADD COLUMN `name_ar` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `name_en` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `emirate_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` MODIFY `region_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Region` ADD CONSTRAINT `Region_emirate_id_fkey` FOREIGN KEY (`emirate_id`) REFERENCES `Emirate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
