/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `color` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `deletedAt`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `deletedAt`;

-- AlterTable
ALTER TABLE `color` DROP COLUMN `deletedAt`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `deletedAt`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `deletedAt`;
