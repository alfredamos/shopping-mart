-- AlterTable
ALTER TABLE `order` ADD COLUMN `status` ENUM('Delivered', 'Pending', 'Returned', 'Shipped') NOT NULL DEFAULT 'Pending';
