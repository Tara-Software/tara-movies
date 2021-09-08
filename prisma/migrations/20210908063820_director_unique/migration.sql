/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Director` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Director.name_unique" ON "Director"("name");
