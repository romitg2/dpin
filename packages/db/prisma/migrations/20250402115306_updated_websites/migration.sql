/*
  Warnings:

  - You are about to drop the column `name` on the `Websites` table. All the data in the column will be lost.
  - Added the required column `solanaBalance` to the `Validator` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Websites_name_key";

-- AlterTable
ALTER TABLE "Validator" ADD COLUMN     "solanaBalance" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Websites" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "Withdrawls" (
    "id" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Withdrawls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Withdrawls" ADD CONSTRAINT "Withdrawls_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
