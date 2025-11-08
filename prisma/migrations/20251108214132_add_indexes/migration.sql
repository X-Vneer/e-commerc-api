-- CreateIndex
CREATE INDEX `Product_is_active_idx` ON `Product`(`is_active`);

-- CreateIndex
CREATE INDEX `Product_createdAt_idx` ON `Product`(`createdAt`);

-- CreateIndex
CREATE INDEX `Product_name_ar_idx` ON `Product`(`name_ar`);

-- CreateIndex
CREATE INDEX `ProductCategory_product_id_idx` ON `ProductCategory`(`product_id`);

-- CreateIndex
CREATE INDEX `ProductInventory_amount_idx` ON `ProductInventory`(`amount`);

-- CreateIndex
CREATE INDEX `ProductInventory_product_size_id_idx` ON `ProductInventory`(`product_size_id`);

-- RenameIndex
ALTER TABLE `productcategory` RENAME INDEX `ProductCategory_category_id_fkey` TO `ProductCategory_category_id_idx`;
