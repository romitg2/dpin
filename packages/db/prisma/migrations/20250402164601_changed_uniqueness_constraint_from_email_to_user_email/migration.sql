/*
  Warnings:

  - A unique constraint covering the columns `[url,userId]` on the table `Websites` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Websites_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Websites_url_userId_key" ON "Websites"("url", "userId");
