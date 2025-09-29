/*
  Warnings:

  - You are about to drop the `Laptop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Laptop" DROP CONSTRAINT "Laptop_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."Laptop";

-- DropTable
DROP TABLE "public"."Order";
