-- CreateTable
CREATE TABLE "Watchlist" (
    "movieId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("movieId", "userId"),
    FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
