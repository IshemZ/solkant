-- AlterTable: Ajouter les colonnes si elles n'existent pas déjà
-- Cette migration est idempotente et peut être exécutée plusieurs fois
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verificationToken" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tokenExpiry" TIMESTAMP(3);

-- CreateIndex: Créer l'index unique si il n'existe pas
CREATE UNIQUE INDEX IF NOT EXISTS "users_verificationToken_key" ON "users"("verificationToken");
