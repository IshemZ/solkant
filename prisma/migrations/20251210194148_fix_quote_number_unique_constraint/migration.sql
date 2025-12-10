-- DropIndex: Remove global unique constraint on quoteNumber
DROP INDEX IF EXISTS "quotes_quoteNumber_key";

-- CreateIndex: Add composite unique constraint on businessId + quoteNumber
CREATE UNIQUE INDEX "quotes_businessId_quoteNumber_key" ON "quotes"("businessId", "quoteNumber");
