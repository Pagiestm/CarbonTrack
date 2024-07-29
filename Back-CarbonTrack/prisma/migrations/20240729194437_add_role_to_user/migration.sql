/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Material_categoryId_fkey` ON `material`;

-- DropIndex
DROP INDEX `Project_userId_fkey` ON `project`;

-- DropIndex
DROP INDEX `ProjectMaterial_materialId_fkey` ON `projectmaterial`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMaterial` ADD CONSTRAINT `ProjectMaterial_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMaterial` ADD CONSTRAINT `ProjectMaterial_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
