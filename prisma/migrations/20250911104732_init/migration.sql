-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);
