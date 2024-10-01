-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "turn" INTEGER DEFAULT 0,
    "gameStatus" TEXT NOT NULL DEFAULT 'in progress',
    "board" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_ActivityToGame" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ActivityToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ActivityToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_player1Id_key" ON "Game"("player1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_player2Id_key" ON "Game"("player2Id");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToGame_AB_unique" ON "_ActivityToGame"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToGame_B_index" ON "_ActivityToGame"("B");
