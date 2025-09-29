/*
  Warnings:

  - Added the required column `quantity` to the `Laptop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CartItem" ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Laptop" ADD COLUMN     "quantity" INTEGER NOT NULL;
