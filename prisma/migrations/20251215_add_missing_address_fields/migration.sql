-- Migration: Add address fields to businesses and clients tables
-- This migration adds the new separated address fields (rue, complement, codePostal, ville)
-- to both businesses and clients tables, replacing the old single "address" field

-- Add address fields to businesses table
ALTER TABLE "businesses"
ADD COLUMN IF NOT EXISTS "rue" TEXT,
ADD COLUMN IF NOT EXISTS "complement" TEXT,
ADD COLUMN IF NOT EXISTS "codePostal" TEXT,
ADD COLUMN IF NOT EXISTS "ville" TEXT;

-- Add address fields to clients table
ALTER TABLE "clients"
ADD COLUMN IF NOT EXISTS "rue" TEXT,
ADD COLUMN IF NOT EXISTS "complement" TEXT,
ADD COLUMN IF NOT EXISTS "codePostal" TEXT,
ADD COLUMN IF NOT EXISTS "ville" TEXT;

-- Add showInstallmentPayment field to businesses (added in same commit)
ALTER TABLE "businesses"
ADD COLUMN IF NOT EXISTS "showInstallmentPayment" BOOLEAN NOT NULL DEFAULT false;
