/*
  Warnings:

  - You are about to drop the column `format` on the `Movie` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT,
    "description" TEXT,
    "directorId" TEXT,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("directorId") REFERENCES "Director" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Movie" ("createdAt", "description", "directorId", "id", "location", "thumbnail", "title") SELECT "createdAt", "description", "directorId", "id", "location", "thumbnail", "title" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie.title_unique" ON "Movie"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
