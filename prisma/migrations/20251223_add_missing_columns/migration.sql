-- Migration différentielle pour synchroniser la production
-- Ajoute uniquement les colonnes et tables manquantes

-- 1. Créer les nouveaux types ENUM
DO $$ BEGIN
  CREATE TYPE "DiscountType" AS ENUM ('NONE', 'PERCENTAGE', 'FIXED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Modifier QuoteStatus ENUM (ajouter nouvelles valeurs si elles n'existent pas)
-- Note: Impossible de SUPPRIMER des valeurs d'un ENUM en Postgres, mais on peut en ajouter
-- Les valeurs ACCEPTED, REJECTED, EXPIRED resteront même si non utilisées

-- 3. Ajouter colonnes manquantes à la table businesses
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "subscriptionEndsAt" TIMESTAMP(3);
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "isPro" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "codePostal" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "complement" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "rue" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "ville" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "showInstallmentPayment" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "pdfFileNamePrefix" TEXT;

-- 4. Ajouter colonnes manquantes à la table clients
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "codePostal" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "complement" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "rue" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "ville" TEXT;

-- 5. Ajouter colonne manquante à la table services
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- 6. Ajouter colonnes manquantes à la table quotes
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "discountType" "DiscountType" NOT NULL DEFAULT 'FIXED';

-- 7. Rendre clientId nullable dans quotes (si actuellement NOT NULL)
ALTER TABLE "quotes" ALTER COLUMN "clientId" DROP NOT NULL;

-- 8. Ajouter colonne manquante à la table quote_items
ALTER TABLE "quote_items" ADD COLUMN IF NOT EXISTS "packageId" TEXT;

-- 9. Créer la table packages si elle n'existe pas
CREATE TABLE IF NOT EXISTS "packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "discountType" "DiscountType" NOT NULL DEFAULT 'NONE',
    "discountValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- 10. Créer la table package_items si elle n'existe pas
CREATE TABLE IF NOT EXISTS "package_items" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "package_items_pkey" PRIMARY KEY ("id")
);

-- 11. Créer la table webhook_events si elle n'existe pas
CREATE TABLE IF NOT EXISTS "webhook_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- 12. Créer la table password_reset_tokens si elle n'existe pas
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- 13. Créer les index manquants (avec IF NOT EXISTS via DO block)

-- Index pour businesses
DO $$ BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS "businesses_stripeCustomerId_key" ON "businesses"("stripeCustomerId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS "businesses_stripeSubscriptionId_key" ON "businesses"("stripeSubscriptionId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "businesses_stripeCustomerId_idx" ON "businesses"("stripeCustomerId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "businesses_stripeSubscriptionId_idx" ON "businesses"("stripeSubscriptionId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

-- Index pour packages
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "packages_businessId_idx" ON "packages"("businessId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "packages_isActive_idx" ON "packages"("isActive");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

-- Index pour package_items
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "package_items_packageId_idx" ON "package_items"("packageId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "package_items_serviceId_idx" ON "package_items"("serviceId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

-- Index pour webhook_events
DO $$ BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS "webhook_events_eventId_key" ON "webhook_events"("eventId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "webhook_events_eventId_idx" ON "webhook_events"("eventId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

-- Index pour password_reset_tokens
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "password_reset_tokens_email_idx" ON "password_reset_tokens"("email");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS "password_reset_tokens_code_idx" ON "password_reset_tokens"("code");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

-- 14. Ajouter les foreign keys manquantes (avec vérification d'existence)

-- Foreign keys pour packages
DO $$ BEGIN
  ALTER TABLE "packages" ADD CONSTRAINT "packages_businessId_fkey"
    FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Foreign keys pour package_items
DO $$ BEGIN
  ALTER TABLE "package_items" ADD CONSTRAINT "package_items_packageId_fkey"
    FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "package_items" ADD CONSTRAINT "package_items_serviceId_fkey"
    FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Foreign keys pour quote_items
DO $$ BEGIN
  ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_packageId_fkey"
    FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
