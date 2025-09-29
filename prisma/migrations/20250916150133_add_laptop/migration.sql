-- CreateTable
CREATE TABLE "public"."Laptop" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "Laptop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Laptop" ADD CONSTRAINT "Laptop_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
