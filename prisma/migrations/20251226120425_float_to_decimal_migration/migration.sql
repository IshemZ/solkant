-- Migration: Float to Decimal(10,2) for financial fields
-- This migration converts Float columns to Decimal(10,2) for precise currency calculations
-- PostgreSQL will automatically convert existing Float values to Decimal with 2 decimal places

-- 1. Alter services table: price column
ALTER TABLE "services"
  ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- 2. Alter quotes table: discount, subtotal, total columns
ALTER TABLE "quotes"
  ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2),
  ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(10,2),
  ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- 3. Alter quote_items table: price, total columns
ALTER TABLE "quote_items"
  ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
  ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- Note: packages.discountValue was already DECIMAL(10,2) in previous migration
-- No data loss expected - existing values will be rounded to 2 decimal places
