-- AlterTable
-- IMPORTANT: Cette migration rend le champ "phone" obligatoire pour les clients.
-- Si des clients existants ont phone = NULL, cette migration échouera.
-- Dans ce cas, vous devez d'abord mettre à jour manuellement ces enregistrements avec un numéro de téléphone valide.

-- Pour vérifier s'il y a des clients avec phone NULL, exécutez :
-- SELECT COUNT(*) FROM clients WHERE phone IS NULL;

-- Pour mettre à jour les clients avec phone NULL (remplacez avec un vrai numéro) :
-- UPDATE clients SET phone = '0000000000' WHERE phone IS NULL;

-- Rendre la colonne phone obligatoire (NOT NULL)
ALTER TABLE "clients" ALTER COLUMN "phone" SET NOT NULL;
