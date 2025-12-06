-- CreateEnum
DO $$ BEGIN
 CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "isPro" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "subscriptionEndsAt" TIMESTAMP(3);
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "businesses_stripeCustomerId_key" ON "businesses"("stripeCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "businesses_stripeSubscriptionId_key" ON "businesses"("stripeSubscriptionId");
CREATE INDEX IF NOT EXISTS "businesses_stripeCustomerId_idx" ON "businesses"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "businesses_stripeSubscriptionId_idx" ON "businesses"("stripeSubscriptionId");
