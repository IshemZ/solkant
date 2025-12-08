-- AlterTable: Rendre clientId nullable dans quotes
ALTER TABLE "quotes" ALTER COLUMN "clientId" DROP NOT NULL;

-- DropForeignKey: Supprimer l'ancienne contrainte pour Quote.client
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_clientId_fkey";

-- AddForeignKey: Ajouter la nouvelle contrainte avec ON DELETE SET NULL pour Quote.client
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropForeignKey: Supprimer l'ancienne contrainte pour QuoteItem.service
ALTER TABLE "quote_items" DROP CONSTRAINT "quote_items_serviceId_fkey";

-- AddForeignKey: Ajouter la nouvelle contrainte avec ON DELETE SET NULL pour QuoteItem.service
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
