/*
  Warnings:

  - You are about to drop the column `creditCardInfoId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_creditCardInfoId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_shippingAddressId_fkey";

-- DropIndex
DROP INDEX "User_creditCardInfoId_key";

-- DropIndex
DROP INDEX "User_shippingAddressId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "creditCardInfoId",
DROP COLUMN "shippingAddressId";
