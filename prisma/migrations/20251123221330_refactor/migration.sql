/*
  Warnings:

  - A unique constraint covering the columns `[size_code,color_id]` on the table `ProductSize` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `ProductSize_size_code_color_id_idx` ON `ProductSize`(`size_code`, `color_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductSize_size_code_color_id_key` ON `ProductSize`(`size_code`, `color_id`);

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_size_code_color_id_fkey` FOREIGN KEY (`size_code`, `color_id`) REFERENCES `ProductSize`(`size_code`, `color_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `productsize` RENAME INDEX `ProductSize_color_id_fkey` TO `ProductSize_color_id_idx`;
