-- DropForeignKey
ALTER TABLE `color` DROP FOREIGN KEY `Color_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `productsize` DROP FOREIGN KEY `ProductSize_color_id_fkey`;

-- DropForeignKey
ALTER TABLE `productsize` DROP FOREIGN KEY `ProductSize_size_code_fkey`;

-- DropIndex
DROP INDEX `ProductSize_color_id_fkey` ON `productsize`;

-- DropIndex
DROP INDEX `ProductSize_size_code_fkey` ON `productsize`;

-- AddForeignKey
ALTER TABLE `Color` ADD CONSTRAINT `Color_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_size_code_fkey` FOREIGN KEY (`size_code`) REFERENCES `Size`(`code`) ON DELETE CASCADE ON UPDATE CASCADE;
