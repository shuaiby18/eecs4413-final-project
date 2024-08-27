/*
  Warnings:

  - You are about to drop the column `userId` on the `CreditCardInfo` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ShippingAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CreditCardInfo" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "ShippingAddress" DROP COLUMN "userId";
