-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "turn" INTEGER DEFAULT 1,
    "gameStatus" TEXT NOT NULL DEFAULT 'in progress',
    "board" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Game" ("board", "created", "gameStatus", "id", "passed", "player1Id", "player2Id", "turn") SELECT "board", "created", "gameStatus", "id", "passed", "player1Id", "player2Id", "turn" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_player1Id_key" ON "Game"("player1Id");
CREATE UNIQUE INDEX "Game_player2Id_key" ON "Game"("player2Id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
