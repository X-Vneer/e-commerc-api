/*
  Warnings:

  - You are about to drop the column `chest` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `hip` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `name_ar` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `size` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `size` DROP COLUMN `chest`,
    DROP COLUMN `hip`,
    DROP COLUMN `name_ar`,
    DROP COLUMN `name_en`;
