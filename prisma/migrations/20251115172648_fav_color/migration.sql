/*
  Warnings:

  - You are about to drop the `_producttouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_producttouser` DROP FOREIGN KEY `_ProductToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttouser` DROP FOREIGN KEY `_ProductToUser_B_fkey`;

-- DropTable
DROP TABLE `_producttouser`;

-- CreateTable
CREATE TABLE `_ColorToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ColorToUser_AB_unique`(`A`, `B`),
    INDEX `_ColorToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ColorToUser` ADD CONSTRAINT `_ColorToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Color`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ColorToUser` ADD CONSTRAINT `_ColorToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
