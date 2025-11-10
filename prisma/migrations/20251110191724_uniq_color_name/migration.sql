/*
  Warnings:

  - A unique constraint covering the columns `[product_id,name_en]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id,name_ar]` on the table `Color` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `Color_name_en_idx` ON `Color`(`name_en`);

-- CreateIndex
CREATE INDEX `Color_name_ar_idx` ON `Color`(`name_ar`);

-- CreateIndex
CREATE UNIQUE INDEX `Color_product_id_name_en_key` ON `Color`(`product_id`, `name_en`);

-- CreateIndex
CREATE UNIQUE INDEX `Color_product_id_name_ar_key` ON `Color`(`product_id`, `name_ar`);
