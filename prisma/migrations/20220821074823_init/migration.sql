-- CreateTable
CREATE TABLE "Tier" (
    "id" SERIAL NOT NULL,
    "role" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "paymentLink" TEXT NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);
