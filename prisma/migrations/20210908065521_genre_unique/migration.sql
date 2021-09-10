/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "has_expired" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("accessToken", "createdAt", "expires", "has_expired", "id", "sessionToken", "updatedAt", "userId") SELECT "accessToken", "createdAt", "expires", "has_expired", "id", "sessionToken", "updatedAt", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session"("accessToken");
CREATE TABLE "new_GenreOnMovie" (
    "movieId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    PRIMARY KEY ("movieId", "genreId"),
    CONSTRAINT "GenreOnMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GenreOnMovie_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GenreOnMovie" ("genreId", "movieId") SELECT "genreId", "movieId" FROM "GenreOnMovie";
DROP TABLE "GenreOnMovie";
ALTER TABLE "new_GenreOnMovie" RENAME TO "GenreOnMovie";
CREATE TABLE "new_Watchlist" (
    "movieId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("movieId", "userId"),
    CONSTRAINT "Watchlist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Watchlist" ("movieId", "userId") SELECT "movieId", "userId" FROM "Watchlist";
DROP TABLE "Watchlist";
ALTER TABLE "new_Watchlist" RENAME TO "Watchlist";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- RedefineIndex
DROP INDEX "Director.name_unique";
CREATE UNIQUE INDEX "Director_name_key" ON "Director"("name");

-- RedefineIndex
DROP INDEX "Movie.title_unique";
CREATE UNIQUE INDEX "Movie_title_key" ON "Movie"("title");

-- RedefineIndex
DROP INDEX "User.email_unique";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- RedefineIndex
DROP INDEX "User.name_unique";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
