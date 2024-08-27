/*
  Warnings:

  - You are about to drop the column `paymentInfoId` on the `CreditCardInfo` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[creditCardInfoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shippingAddressId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `cvv` on the `CreditCardInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CreditCardInfo" DROP CONSTRAINT "CreditCardInfo_paymentInfoId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_paymentInfoId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToOrderItem" DROP CONSTRAINT "_OrderToOrderItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToOrderItem" DROP CONSTRAINT "_OrderToOrderItem_B_fkey";

-- DropIndex
DROP INDEX "CartItem_userId_productId_key";

-- DropIndex
DROP INDEX "CreditCardInfo_paymentInfoId_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "CreditCardInfo" DROP COLUMN "paymentInfoId",
ADD COLUMN     "userId" TEXT,
DROP COLUMN "cvv",
ADD COLUMN     "cvv" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethod",
ADD COLUMN     "checkouted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ShippingAddress" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creditCardInfoId" TEXT,
ADD COLUMN     "shippingAddressId" TEXT;

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "PaymentInfo";

-- DropTable
DROP TABLE "_OrderToOrderItem";

-- DropEnum
DROP TYPE "PaymentMethod";

-- CreateIndex
CREATE UNIQUE INDEX "User_creditCardInfoId_key" ON "User"("creditCardInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_shippingAddressId_key" ON "User"("shippingAddressId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_creditCardInfoId_fkey" FOREIGN KEY ("creditCardInfoId") REFERENCES "CreditCardInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "ShippingAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentInfoId_fkey" FOREIGN KEY ("paymentInfoId") REFERENCES "CreditCardInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
