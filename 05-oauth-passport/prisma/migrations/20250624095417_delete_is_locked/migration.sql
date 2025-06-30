/*
  Warnings:

  - You are about to drop the column `isLocked` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "loginAttempts", "password", "provider", "providerId", "username") SELECT "id", "loginAttempts", "password", "provider", "providerId", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
