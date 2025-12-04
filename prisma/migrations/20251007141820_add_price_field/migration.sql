/*
  Warnings:

  - Added the required column `price` to the `Laptop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Laptop" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
