# Design : Migration Float → Decimal pour les Champs Financiers

**Date :** 2025-12-26
**Statut :** Design validé - En attente d'implémentation
**Auteur :** Conception collaborative
**Priorité :** P0 - Critique

## Objectif

Migrer tous les champs financiers de `Float` vers `Decimal(10,2)` pour garantir la précision des calculs monétaires et éliminer les erreurs d'arrondi IEEE 754.

## Contexte

### Problème Actuel

L'application utilise actuellement le type `Float` pour 6 champs financiers critiques :
- `Service.price`
- `Quote.discount`, `Quote.subtotal`, `Quote.total`
- `QuoteItem.price`, `QuoteItem.total`

Seul `Package.discountValue` utilise correctement `Decimal(10,2)`, créant une incohérence.

### Impact du Problème

**Erreurs d'arrondi potentielles :**
```javascript
// Exemple de bug Float typique :
0.1 + 0.2 === 0.3  // false
0.1 + 0.2          // 0.30000000000004

// Scénario réel :
// Quote avec 3 items à 33.33€
33.33 + 33.33 + 33.33 = 99.99000000000001
(99.99000000000001 * 0.9) = 89.991 au lieu de 89.99
```

**Risques identifiés :**
- Calculs de totaux imprécis sur quotes complexes
- Divergence entre subtotal affiché et somme réelle des items
- Non-conformité pour une application de facturation professionnelle

### Décisions Clés

1. **Données production :** Application déjà en production avec données clients réelles
2. **Downtime :** Fenêtre de maintenance flexible acceptée (30-60 min)
3. **Recalcul :** Tous les quotes existants seront recalculés avec précision Decimal (pas de préservation des erreurs Float)
4. **Logging :** Statistiques globales de migration (nombre de quotes modifiés, delta moyen)

---

## Architecture de la Migration

### Vue d'Ensemble

**Approche choisie :** Migration SQL directe avec script de recalcul

**Principe :**
1. Migration Prisma : Altérer les colonnes `Float → Decimal(10,2)`
2. Script Node.js post-migration : Recalculer tous les totaux avec Prisma Decimal
3. Déploiement atomique pendant fenêtre de maintenance

**Alternatives rejetées :**
- ❌ Migration en deux phases (colonnes temporaires) : trop complexe pour gain minimal
- ❌ Feature flag avec double écriture : over-engineering pour cas simple

### Phases de Migration

#### Phase 1 : Préparation (avant maintenance)

```bash
# 1. Tests sur clone de production
pg_dump $PROD_DATABASE_URL > prod_backup.sql
psql $STAGING_DATABASE_URL < prod_backup.sql
npx prisma migrate deploy
npx tsx scripts/recalculate-quote-totals.ts

# 2. Validation staging
# - Tests unitaires (80%+ coverage)
# - Tests E2E (création/édition quotes, génération PDF)
# - Vérification calculs Decimal corrects

# 3. Build production
npm run build
# Vérifier aucune erreur TypeScript/ESLint
```

#### Phase 2 : Fenêtre de Maintenance (30-60 min)

**Checklist de déploiement :**

```
[ ] 1. Annoncer maintenance (H-24h)
[ ] 2. Créer backup production complet
    → pg_dump avec timestamp
    → Sauvegarder sur stockage sécurisé

[ ] 3. Activer mode maintenance
    → Bloquer accès app (page maintenance)

[ ] 4. Exécuter migration Prisma
    → npx prisma migrate deploy
    → Durée estimée : 2-5 min

[ ] 5. Exécuter script de recalcul
    → npx tsx scripts/recalculate-quote-totals.ts
    → Noter statistiques (quotes modifiés, delta moyen)
    → Durée estimée : 5-15 min selon volume

[ ] 6. Smoke tests post-migration
    → Vérifier 3-5 quotes aléatoires en DB
    → Comparer totaux avant/après (delta acceptable)

[ ] 7. Déployer nouveau code applicatif
    → git push origin main (déclenchera Vercel)
    → Attendre build réussi

[ ] 8. Tests manuels en production
    → Créer un quote test
    → Éditer un quote existant
    → Générer PDF
    → Vérifier calculs corrects

[ ] 9. Désactiver mode maintenance

[ ] 10. Monitoring post-déploiement (24h)
    → Surveiller Sentry (0 erreur attendue)
    → Vérifier logs Vercel
    → Tester avec 2-3 vrais utilisateurs
```

#### Phase 3 : Validation Post-Déploiement

**Critères de succès :**
- ✅ Migration SQL exécutée sans erreur
- ✅ Script de recalcul terminé (delta moyen < 0.05€)
- ✅ Aucune erreur Sentry dans les 2h post-déploiement
- ✅ PDF générés correctement
- ✅ Calculs de totaux précis (vérifiés manuellement sur 5+ quotes)

**Tests validation :**
- Créer nouveau quote avec services + packages + remise globale
- Éditer quote existant (DRAFT et SENT)
- Générer PDF et vérifier formatage prix
- Vérifier paiement en 4× (quote.total / 4)
- Comparer calculs manuels vs calculs app

---

## Modifications du Schéma Prisma

### Changements `prisma/schema.prisma`

```prisma
model Service {
  id           String        @id @default(cuid())
  name         String
  description  String?
  price        Decimal       @db.Decimal(10, 2)  // ← CHANGÉ : Float → Decimal
  duration     Int?
  category     String?
  isActive     Boolean       @default(true)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  businessId   String
  deletedAt    DateTime?
  packageItems PackageItem[]
  quoteItems   QuoteItem[]
  business     Business      @relation(fields: [businessId], references: [id], onDelete: Cascade)

  @@index([businessId])
  @@map("services")
}

model Quote {
  id           String       @id @default(cuid())
  quoteNumber  String
  status       QuoteStatus  @default(DRAFT)
  validUntil   DateTime?
  notes        String?
  discount     Decimal      @default(0) @db.Decimal(10, 2)  // ← CHANGÉ
  subtotal     Decimal      @default(0) @db.Decimal(10, 2)  // ← CHANGÉ
  total        Decimal      @default(0) @db.Decimal(10, 2)  // ← CHANGÉ
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  sentAt       DateTime?
  businessId   String
  clientId     String?
  discountType DiscountType @default(FIXED)
  items        QuoteItem[]
  business     Business     @relation(fields: [businessId], references: [id], onDelete: Cascade)
  client       Client?      @relation(fields: [clientId], references: [id], onDelete: SetNull)

  @@unique([businessId, quoteNumber])
  @@index([businessId])
  @@index([clientId])
  @@map("quotes")
}

model QuoteItem {
  id          String   @id @default(cuid())
  serviceId   String?
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)  // ← CHANGÉ
  quantity    Int      @default(1)
  total       Decimal  @db.Decimal(10, 2)  // ← CHANGÉ
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  quoteId     String
  packageId   String?
  package     Package? @relation(fields: [packageId], references: [id], onDelete: SetNull)
  quote       Quote    @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  service     Service? @relation(fields: [serviceId], references: [id], onDelete: SetNull)

  @@index([quoteId])
  @@map("quote_items")
}

// Package.discountValue INCHANGÉ (déjà en Decimal)
model Package {
  // ...
  discountValue  Decimal       @default(0) @db.Decimal(10, 2)  // ✅ Déjà correct
  // ...
}
```

### Migration SQL Générée

**Commande :**
```bash
npx prisma migrate dev --name float_to_decimal_migration
```

**SQL généré (par Prisma) :**
```sql
-- Migration automatique Float → Decimal
ALTER TABLE "services"
  ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

ALTER TABLE "quotes"
  ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2),
  ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(10,2),
  ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

ALTER TABLE "quote_items"
  ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
  ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);
```

**Comportement PostgreSQL :** Les valeurs Float existantes seront automatiquement converties vers Decimal. Aucune perte de données.

---

## Script de Recalcul des Totaux

### Fichier : `scripts/recalculate-quote-totals.ts`

**Objectif :** Recalculer tous les quotes existants avec la précision Decimal pour corriger les erreurs d'arrondi Float.

### Logique de Recalcul

Pour chaque quote :

1. **Charger le quote avec relations**
   ```typescript
   const quotes = await prisma.quote.findMany({
     include: {
       items: {
         include: { package: true, service: true }
       }
     }
   });
   ```

2. **Recalculer selon logique métier**
   - **Subtotal :** Somme des `item.total` (price × quantity)
   - **Remises forfaits :** Calculer depuis `Package.discountValue` si `item.packageId` existe
   - **Remise globale :** Selon `Quote.discountType` (PERCENTAGE ou FIXED)
   - **Total final :** `subtotal - remises_forfaits - remise_globale`

3. **Mettre à jour si différence**
   ```typescript
   const delta = newTotal.minus(new Decimal(quote.total));
   if (!delta.isZero()) {
     await prisma.quote.update({
       where: { id: quote.id },
       data: { subtotal: newSubtotal, total: newTotal }
     });
   }
   ```

### Structure du Script

```typescript
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

/**
 * Calcule les totaux d'un quote avec précision Decimal
 */
function calculateQuoteTotals(quote: QuoteWithRelations) {
  // 1. Calculer subtotal des items
  const subtotal = quote.items.reduce(
    (sum, item) => sum.add(new Decimal(item.total)),
    new Decimal(0)
  );

  // 2. Calculer remises forfaits
  const packageDiscountsTotal = quote.items.reduce((sum, item) => {
    if (!item.packageId || !item.package) return sum;

    const basePrice = new Decimal(item.price);
    let discount = new Decimal(0);

    if (item.package.discountType === 'PERCENTAGE') {
      discount = basePrice.times(item.package.discountValue).div(100);
    } else if (item.package.discountType === 'FIXED') {
      discount = new Decimal(item.package.discountValue);
    }

    return sum.add(discount);
  }, new Decimal(0));

  // 3. Sous-total après remises forfaits
  const subtotalAfterPackageDiscounts = subtotal.minus(packageDiscountsTotal);

  // 4. Calculer remise globale
  const discountValue = new Decimal(quote.discount);
  const discountAmount = quote.discountType === 'PERCENTAGE'
    ? subtotalAfterPackageDiscounts.times(discountValue).div(100)
    : discountValue;

  // 5. Total final
  const total = subtotalAfterPackageDiscounts.minus(discountAmount);

  return {
    newSubtotal: subtotal,
    newTotal: total
  };
}

/**
 * Recalcule tous les quotes existants
 */
async function recalculateQuoteTotals() {
  console.log('🔄 Début du recalcul des totaux de quotes...\n');

  const quotes = await prisma.quote.findMany({
    include: {
      items: {
        include: {
          package: true,
          service: true
        }
      }
    }
  });

  console.log(`📊 Total de quotes à traiter : ${quotes.length}\n`);

  let updatedCount = 0;
  let totalDelta = new Decimal(0);
  let maxDelta = new Decimal(0);

  for (const quote of quotes) {
    const { newSubtotal, newTotal } = calculateQuoteTotals(quote);

    const delta = newTotal.minus(new Decimal(quote.total)).abs();

    if (!delta.isZero()) {
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          subtotal: newSubtotal,
          total: newTotal
        }
      });

      updatedCount++;
      totalDelta = totalDelta.plus(delta);

      if (delta.greaterThan(maxDelta)) {
        maxDelta = delta;
      }
    }
  }

  console.log('\n✅ Migration terminée\n');
  console.log('📈 Statistiques :');
  console.log(`   • Quotes traités : ${quotes.length}`);
  console.log(`   • Quotes mis à jour : ${updatedCount}`);
  console.log(`   • Quotes inchangés : ${quotes.length - updatedCount}`);

  if (updatedCount > 0) {
    const avgDelta = totalDelta.div(updatedCount);
    console.log(`   • Delta moyen : ${avgDelta.toFixed(4)}€`);
    console.log(`   • Delta maximum : ${maxDelta.toFixed(4)}€`);
  }

  await prisma.$disconnect();
}

recalculateQuoteTotals().catch((error) => {
  console.error('❌ Erreur lors du recalcul :', error);
  process.exit(1);
});
```

### Logging de Migration

**Output attendu :**
```
🔄 Début du recalcul des totaux de quotes...

📊 Total de quotes à traiter : 247

✅ Migration terminée

📈 Statistiques :
   • Quotes traités : 247
   • Quotes mis à jour : 42
   • Quotes inchangés : 205
   • Delta moyen : 0.0123€
   • Delta maximum : 0.0500€
```

---

## Utilitaires et Helpers Decimal

### Fichier : `lib/decimal-utils.ts` (NOUVEAU)

Centralise les utilitaires pour manipuler les Decimal dans l'application.

```typescript
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Convertit Decimal vers number pour sérialisation Next.js
 *
 * @example
 * const price = new Decimal("123.45");
 * toNumber(price) // 123.45
 */
export function toNumber(value: Decimal | number): number {
  return value instanceof Decimal ? value.toNumber() : value;
}

/**
 * Convertit number/string vers Decimal
 *
 * @example
 * toDecimal(123.45) // Decimal("123.45")
 * toDecimal("99.99") // Decimal("99.99")
 */
export function toDecimal(value: number | string | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
}

/**
 * Formate un montant Decimal/number en euros
 *
 * @example
 * formatCurrency(123.45) // "123.45 €"
 * formatCurrency(new Decimal("999.99")) // "999.99 €"
 */
export function formatCurrency(amount: Decimal | number): string {
  const num = toNumber(amount);
  return `${num.toFixed(2)} €`;
}

/**
 * Calcule le subtotal d'une liste d'items avec Decimal
 *
 * @example
 * const items = [
 *   { price: 10.50, quantity: 2 },
 *   { price: 25.00, quantity: 1 }
 * ];
 * calculateSubtotal(items) // Decimal("46.00")
 */
export function calculateSubtotal(
  items: Array<{ price: Decimal | number; quantity: number }>
): Decimal {
  return items.reduce(
    (sum, item) => sum.add(toDecimal(item.price).times(item.quantity)),
    new Decimal(0)
  );
}

/**
 * Calcule le montant de remise selon le type
 *
 * @example
 * // Remise pourcentage
 * calculateDiscount(100, 'PERCENTAGE', 20) // Decimal("20.00")
 *
 * // Remise fixe
 * calculateDiscount(100, 'FIXED', 15) // Decimal("15.00")
 */
export function calculateDiscount(
  subtotal: Decimal | number,
  discountType: 'PERCENTAGE' | 'FIXED' | 'NONE',
  discountValue: Decimal | number
): Decimal {
  if (discountType === 'NONE') {
    return new Decimal(0);
  }

  const base = toDecimal(subtotal);
  const discount = toDecimal(discountValue);

  if (discountType === 'PERCENTAGE') {
    return base.times(discount).div(100);
  }

  return discount; // FIXED
}

/**
 * Sérialise récursivement les Decimal en number dans un objet
 * Utilisé pour les retours de Server Actions Next.js
 *
 * @example
 * const data = {
 *   price: new Decimal("99.99"),
 *   items: [{ total: new Decimal("10.50") }]
 * };
 * serializeDecimalFields(data)
 * // { price: 99.99, items: [{ total: 10.5 }] }
 */
export function serializeDecimalFields<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Decimal) {
    return data.toNumber() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeDecimalFields(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      result[key] = serializeDecimalFields(data[key]);
    }
    return result;
  }

  return data;
}
```

### Tests Unitaires

Créer `tests/lib/decimal-utils.test.ts` :

```typescript
import { describe, it, expect } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';
import {
  toNumber,
  toDecimal,
  formatCurrency,
  calculateSubtotal,
  calculateDiscount,
  serializeDecimalFields
} from '@/lib/decimal-utils';

describe('decimal-utils', () => {
  describe('toNumber', () => {
    it('convertit Decimal en number', () => {
      expect(toNumber(new Decimal('123.45'))).toBe(123.45);
    });

    it('retourne number tel quel', () => {
      expect(toNumber(99.99)).toBe(99.99);
    });
  });

  describe('calculateDiscount', () => {
    it('calcule remise PERCENTAGE correctement', () => {
      const result = calculateDiscount(100, 'PERCENTAGE', 20);
      expect(result.toNumber()).toBe(20);
    });

    it('calcule remise FIXED correctement', () => {
      const result = calculateDiscount(100, 'FIXED', 15);
      expect(result.toNumber()).toBe(15);
    });

    it('retourne 0 pour NONE', () => {
      const result = calculateDiscount(100, 'NONE', 0);
      expect(result.toNumber()).toBe(0);
    });
  });

  // ... autres tests
});
```

---

## Modifications des Server Actions

### Fichier : `app/actions/quotes.ts`

**Imports :**
```typescript
import { Decimal } from '@prisma/client/runtime/library';
import {
  toDecimal,
  calculateDiscount,
  serializeDecimalFields
} from '@/lib/decimal-utils';
```

**Fonction `createQuote()` - Calculs avec Decimal :**

```typescript
// AVANT (Float) :
const subtotal = items.reduce((sum, item) => sum + item.total, 0);
const discountType = quoteData.discountType || 'FIXED';
const discountValue = quoteData.discount || 0;
const discountAmount = discountType === 'PERCENTAGE'
  ? subtotal * (discountValue / 100)
  : discountValue;
const total = subtotal - discountAmount;

// APRÈS (Decimal) :
const subtotal = items.reduce(
  (sum, item) => sum.add(toDecimal(item.total)),
  new Decimal(0)
);

const discountType = quoteData.discountType || 'FIXED';
const discountValue = quoteData.discount || 0;

const discountAmount = calculateDiscount(
  subtotal,
  discountType,
  discountValue
);

const total = subtotal.minus(discountAmount);
```

**Fonction `updateQuote()` - Même logique :**

```typescript
// Recalcul subtotal si items modifiés
if (quoteData.items) {
  subtotal = quoteData.items.reduce(
    (sum, item) => sum.add(toDecimal(item.total)),
    new Decimal(0)
  );

  const discountAmount = calculateDiscount(
    subtotal,
    discountType,
    discountValue
  );

  total = subtotal.minus(discountAmount);
}
```

**Sérialisation pour Next.js :**

```typescript
// Retour de Server Action
return {
  data: serializeDecimalFields({
    ...quote,
    items: quote.items
  })
};
```

### Fichier : `app/actions/services.ts`

Aucune modification de logique nécessaire. Prisma gère automatiquement la conversion `number → Decimal` lors de l'insertion.

**Sérialisation uniquement :**
```typescript
export async function getServices(): Promise<ActionResult<Service[]>> {
  // ...
  const services = await prisma.service.findMany({ /* ... */ });

  return {
    data: serializeDecimalFields(services)
  };
}
```

### Fichier : `app/actions/packages.ts`

**Généraliser `serializePackage()` existant :**

```typescript
// AVANT (conversion manuelle) :
function serializePackage(pkg: PackageWithRelations) {
  return {
    ...pkg,
    discountValue: Number((pkg as any).discountValue),
    items: pkg.items.map((item) => ({
      ...item,
      service: item.service ? {
        ...item.service,
        price: Number((item.service as any).price),
      } : null,
    })),
  };
}

// APRÈS (utiliser helper) :
import { serializeDecimalFields } from '@/lib/decimal-utils';

function serializePackage(pkg: PackageWithRelations) {
  return serializeDecimalFields(pkg);
}
```

---

## Modifications des Composants React

### Composants de Formulaires

**Fichiers :** `QuoteFormNew.tsx`, `QuoteFormEdit.tsx`, `ServiceForm.tsx`

**Principe :** Les formulaires manipulent des `number` (inputs HTML). Les données arrivent déjà sérialisées (Decimal → number) depuis les Server Actions.

**Aucune modification structurelle nécessaire.**

**Seule amélioration - Calculs locaux en temps réel :**

```typescript
// Dans QuoteFormNew.tsx / QuoteFormEdit.tsx
// AVANT (risque d'arrondi Float pendant la saisie) :
const subtotal = items.reduce((sum, item) => sum + item.total, 0);

// APRÈS (arrondir explicitement pour affichage) :
const subtotal = items.reduce((sum, item) => {
  // Arrondir à 2 décimales pour éviter affichage 99.99000001
  return Math.round((sum + item.total) * 100) / 100;
}, 0);
```

**Note :** Le calcul définitif se fait côté serveur en Decimal. L'arrondi côté client est uniquement pour l'affichage temps réel.

### Composant PDF

**Fichier : `components/pdf/QuotePDF.tsx`**

**Aucune modification nécessaire.** Les valeurs arrivent sérialisées en `number`, et `.toFixed(2)` fonctionne sur number.

```typescript
// Fonctionne déjà (pas de changement) :
{quote.total.toFixed(2)} €
{item.price.toFixed(2)} €
{(quote.total / 4).toFixed(2)} €  // Paiement en 4×
```

### Validations Zod

**Fichiers :** `lib/validations/quote.ts`, `lib/validations/service.ts`

**Aucun changement nécessaire.** Zod valide les `number` côté client. Prisma convertit automatiquement vers Decimal lors de l'insertion en base.

```typescript
// Reste inchangé :
export const createServiceSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  price: z.number().positive("Le prix doit être positif"),
  // ...
});
```

---

## Plan de Déploiement Production

### Pré-Requis

**1. Tests sur clone de production (OBLIGATOIRE)**

```bash
# Copier dump production vers staging
pg_dump $PROD_DATABASE_URL > prod_backup_$(date +%Y%m%d_%H%M%S).sql
psql $STAGING_DATABASE_URL < prod_backup_*.sql

# Exécuter migration sur staging
cd /path/to/project
npx prisma migrate deploy
npx tsx scripts/recalculate-quote-totals.ts

# Vérifier résultats
# - Comparer 10 quotes aléatoires (anciens vs nouveaux totaux)
# - Delta moyen acceptable (< 0.05€)
```

**2. Tests automatisés**

```bash
# Tests unitaires
npm run test:run
# Coverage attendue : 80%+ sur lib/decimal-utils.ts

# Tests E2E
npm run test:e2e
# Scénarios : créer quote, éditer quote, générer PDF

# Build production
npm run build
# Vérifier 0 erreur TypeScript/ESLint
```

**3. Communication**

- [ ] Email clients : "Maintenance planifiée le [DATE] de [HEURE] à [HEURE]"
- [ ] Bannière dans l'app (H-24h) : "Maintenance prévue demain"
- [ ] Status page mise à jour (si existe)

### Checklist Jour J (Fenêtre 30-60 min)

```
PHASE 1 : BACKUP (5 min)
[ ] Créer backup PostgreSQL complet
    → pg_dump $DATABASE_URL > backup_prod_$(date +%Y%m%d_%H%M%S).sql
    → Vérifier taille fichier cohérente
    → Sauvegarder sur S3/stockage sécurisé

PHASE 2 : MODE MAINTENANCE (1 min)
[ ] Activer page de maintenance
    → Bloquer accès utilisateurs
    → Message : "Maintenance en cours, retour dans 30-45 min"

PHASE 3 : MIGRATION DATABASE (2-5 min)
[ ] Exécuter migration Prisma
    → npx prisma migrate deploy
    → Vérifier output : "All migrations have been successfully applied"

PHASE 4 : RECALCUL TOTAUX (5-15 min)
[ ] Exécuter script de recalcul
    → npx tsx scripts/recalculate-quote-totals.ts
    → Noter statistiques dans logs :
      • Quotes traités : X
      • Quotes modifiés : Y
      • Delta moyen : Z€
      • Delta max : W€

PHASE 5 : SMOKE TESTS DB (3 min)
[ ] Vérifier 5 quotes aléatoires en base
    → SELECT * FROM quotes ORDER BY RANDOM() LIMIT 5;
    → Comparer avec backup (delta acceptable < 0.05€)

PHASE 6 : DÉPLOIEMENT CODE (5-10 min)
[ ] Pousser code vers production
    → git push origin main
    → Attendre build Vercel réussi
    → Vérifier logs déploiement : 0 erreur

PHASE 7 : TESTS PRODUCTION (5 min)
[ ] Tests manuels critiques :
    → Créer un quote test (service + package + remise)
    → Vérifier calculs corrects (subtotal, total)
    → Générer PDF, vérifier formatage prix
    → Éditer quote existant (DRAFT)
    → Vérifier quote SENT non modifiable

PHASE 8 : DÉSACTIVER MAINTENANCE (1 min)
[ ] Rendre app accessible
    → Retirer page maintenance
    → Vérifier accès utilisateur OK

PHASE 9 : MONITORING (24h)
[ ] Surveiller Sentry : 0 erreur attendue
[ ] Vérifier logs Vercel : pas d'erreur 500
[ ] Tester avec 2-3 utilisateurs réels (si possible)
[ ] Surveiller métriques performance (temps réponse)
```

### Critères de Succès

**Migration réussie si :**
- ✅ Migration SQL exécutée sans erreur PostgreSQL
- ✅ Script de recalcul terminé (delta moyen < 0.05€, delta max < 0.10€)
- ✅ Aucune erreur Sentry dans les 2h post-déploiement
- ✅ PDF générés correctement (prix formatés à 2 décimales)
- ✅ Calculs de totaux précis (vérification manuelle sur 5+ quotes)
- ✅ Temps de réponse API inchangé (< +10%)

**Si UN critère échoue → Rollback immédiat**

### Plan de Rollback

**Si problème critique détecté (erreurs massives, calculs incorrects) :**

```bash
# 1. Activer mode maintenance IMMÉDIATEMENT
echo "ROLLBACK EN COURS"

# 2. Restaurer backup PostgreSQL
psql $DATABASE_URL < backup_prod_[timestamp].sql
# Durée estimée : 5-10 min selon taille DB

# 3. Redéployer code précédent
git revert [commit_hash_migration]
git push origin main --force-with-lease
# Attendre build Vercel (3-5 min)

# 4. Vérifier rollback réussi
# - Tester création quote
# - Vérifier PDF
# - Comparer avec backup

# 5. Désactiver maintenance
# - Communiquer aux utilisateurs
# - Post-mortem : analyser cause échec

# 6. Planifier nouvelle tentative
# - Corriger problème identifié
# - Re-tester sur staging
```

**Temps de rollback estimé : 10-15 minutes**

**Risque de perte de données :** Si quotes créés pendant les 5-15 min de migration, ils seront perdus lors du rollback. **Solution :** Bloquer accès app dès début maintenance.

---

## Gestion d'Erreurs et Cas Limites

### Cas à Gérer

**1. Quote avec items supprimés**

Si `QuoteItem.serviceId` ou `QuoteItem.packageId` référence un élément supprimé (`deletedAt IS NOT NULL`) :

```typescript
// Script de recalcul doit gérer :
if (item.package && item.package.deletedAt) {
  // Ne pas recalculer la remise, utiliser le prix stocké
  console.warn(`Quote ${quote.id} : Package ${item.packageId} supprimé`);
}
```

**Solution :** Préserver le prix stocké pour les packages/services supprimés.

**2. Total négatif après remises**

```typescript
// Validation dans Server Action
if (total.lessThan(0)) {
  return {
    error: "Le total ne peut pas être négatif. Vérifiez les remises."
  };
}
```

**3. Remise > 100% sur PERCENTAGE**

```typescript
// Validation Zod
discount: z.number().min(0).max(100).when('discountType', {
  is: 'PERCENTAGE',
  then: z.number().max(100, "La remise ne peut pas dépasser 100%")
})
```

**4. Precision Decimal dépassée**

Decimal(10,2) permet :
- 8 chiffres avant la virgule (max : 99 999 999,99€)
- 2 chiffres après la virgule

Si dépassement :
```typescript
// Prisma lèvera une erreur automatiquement
// Gérer côté validation Zod :
price: z.number().positive().max(99999999.99, "Prix trop élevé")
```

### Tests de Robustesse

Créer tests E2E pour :
- [ ] Quote avec 100 items (performance)
- [ ] Quote avec remise 99.99% (cas limite)
- [ ] Quote avec service supprimé (soft delete)
- [ ] Quote avec package supprimé
- [ ] Quote avec prix très élevé (9 999 999,99€)
- [ ] Quote avec prix très bas (0,01€)

---

## Fichiers Impactés

### Nouveaux Fichiers (3)

```
lib/decimal-utils.ts                            # Utilitaires Decimal
scripts/recalculate-quote-totals.ts             # Script migration
prisma/migrations/XXXXXX_float_to_decimal/      # Migration SQL
tests/lib/decimal-utils.test.ts                 # Tests unitaires
```

### Fichiers Modifiés (8-10)

**Schema et migrations :**
- `prisma/schema.prisma` (types Float → Decimal)

**Server Actions :**
- `app/actions/quotes.ts` (calculs Decimal)
- `app/actions/services.ts` (sérialisation)
- `app/actions/packages.ts` (généraliser serialize)

**Composants React :**
- `app/(dashboard)/dashboard/devis/_components/QuoteFormNew.tsx` (arrondi display)
- `app/(dashboard)/dashboard/devis/_components/QuoteFormEdit.tsx` (arrondi display)
- `app/(dashboard)/dashboard/services/_components/ServiceForm.tsx` (potentiel)

**Validations (potentiellement) :**
- `lib/validations/quote.ts` (contraintes remises)
- `lib/validations/service.ts` (max price)

**Documentation :**
- `CLAUDE.md` (mettre à jour section "Critical Gotchas")
- `docs/plans/2025-12-26-float-to-decimal-migration-design.md` (ce fichier)

**Total estimé : 11-13 fichiers**

---

## Migration des Données Existantes

### Comportement Automatique PostgreSQL

**Lors de `ALTER COLUMN price SET DATA TYPE DECIMAL(10,2)` :**

1. PostgreSQL convertit automatiquement chaque valeur Float vers Decimal
2. Les valeurs sont arrondies à 2 décimales (bankers' rounding)
3. Aucune perte de données si valeurs < 99 999 999,99

**Exemple :**
```sql
-- Avant migration (Float) :
price = 99.99000000000001  (erreur IEEE 754)

-- Après migration (Decimal) :
price = 99.99  (arrondi automatique)
```

### Recalcul Post-Migration

**Pourquoi recalculer ?**

Même si PostgreSQL arrondit les valeurs individuelles, les **totaux calculés** (subtotal, total) peuvent avoir été stockés avec des erreurs d'arrondi Float accumulées.

**Exemple :**
```
Quote créé avec Float :
  Item 1 : 33.33€
  Item 2 : 33.33€
  Item 3 : 33.33€
  Subtotal stocké : 99.99000000000001€  ← Erreur Float

Après recalcul Decimal :
  Subtotal = 33.33 + 33.33 + 33.33 = 99.99€  ← Précis
```

**Le script corrige ces divergences.**

### Impacts Utilisateurs

**Quotes DRAFT :**
- Totaux recalculés → peuvent changer légèrement (±0.05€)
- Acceptable car non envoyés au client

**Quotes SENT :**
- Totaux recalculés également
- **Justification :** Corriger les erreurs améliore la précision comptable
- **Risque minimal :** Delta attendu < 0.05€ (imperceptible)

**Communication recommandée :**
"Nous avons amélioré la précision de nos calculs de prix. Les totaux de vos devis peuvent avoir été ajustés de quelques centimes pour garantir une facturation exacte."

---

## Impact Performance

### Temps d'Exécution Estimés

**Migration SQL :**
- Petit volume (< 1000 quotes) : 2-3 min
- Volume moyen (1000-10000 quotes) : 3-5 min
- Gros volume (> 10000 quotes) : 5-10 min

**Script de recalcul :**
- Traitement : ~50-100 quotes/seconde
- 1000 quotes : 10-20 secondes
- 10000 quotes : 2-3 minutes

**Total fenêtre maintenance :** 15-30 min (incluant tests)

### Impact Runtime Application

**Calculs Decimal vs Float :**
- Decimal est ~2-3× plus lent que Float
- Mais impact négligeable car calculs côté serveur uniquement
- Temps réponse API : +5-10ms maximum (imperceptible)

**Sérialisation Next.js :**
- Conversion Decimal → Number ajoute ~1-2ms par quote
- Négligeable avec helper optimisé `serializeDecimalFields()`

**Conclusion :** Aucun impact performance perceptible pour l'utilisateur.

---

## Tests et Validation

### Tests Unitaires

**Fichier : `tests/lib/decimal-utils.test.ts`**

Couverture requise : **80%+**

**Scénarios :**
- Conversion Decimal ↔ Number
- Calculs subtotal (somme items)
- Calculs remises (PERCENTAGE, FIXED, NONE)
- Formatage currency
- Sérialisation récursive

### Tests E2E

**Fichier : `tests/e2e/quotes-decimal.spec.ts`**

**Scénarios critiques :**

1. **Créer quote avec services**
   - Ajouter 3 services à prix décimaux (ex: 33.33€)
   - Vérifier subtotal = 99.99€ (pas 99.99000001€)

2. **Créer quote avec packages**
   - Ajouter package avec remise 20%
   - Vérifier remise calculée correctement
   - Vérifier total final précis

3. **Créer quote avec remise globale**
   - Remise PERCENTAGE (10%)
   - Remise FIXED (15€)
   - Vérifier ordre application (packages → globale)

4. **Éditer quote existant**
   - Modifier quantité item
   - Vérifier recalcul temps réel
   - Vérifier sauvegarde en Decimal

5. **Générer PDF**
   - Créer quote complexe
   - Générer PDF
   - Vérifier formatage prix (2 décimales, espace avant €)
   - Vérifier paiement 4× (total / 4)

### Tests Manuels Production

**Après déploiement (5 min) :**

```
[ ] Créer nouveau quote
    → 2 services (prix différents)
    → 1 package avec remise
    → Remise globale 10%
    → Vérifier calculs manuellement

[ ] Éditer quote DRAFT existant
    → Modifier quantité
    → Ajouter item
    → Vérifier recalcul

[ ] Consulter quote SENT
    → Vérifier affichage totaux
    → Générer PDF
    → Comparer PDF vs écran

[ ] Tester avec prix "difficiles"
    → Service à 33.33€ × 3
    → Vérifier subtotal = 99.99€
```

---

## Maintenance Future

### Bonnes Pratiques Post-Migration

**1. Toujours utiliser helpers Decimal**

```typescript
// ✅ BON
import { calculateDiscount } from '@/lib/decimal-utils';
const discount = calculateDiscount(subtotal, 'PERCENTAGE', 20);

// ❌ MAUVAIS
const discount = subtotal * 0.2; // Risque Float
```

**2. Sérialiser avant retour Next.js**

```typescript
// ✅ BON
return { data: serializeDecimalFields(quote) };

// ❌ MAUVAIS
return { data: quote }; // Erreur sérialisation Decimal
```

**3. Valider précision Decimal**

```typescript
// Ajouter dans les tests :
expect(total.toNumber()).toBeCloseTo(99.99, 2); // Précision 2 décimales
```

### Documentation Mise à Jour

**Mettre à jour `CLAUDE.md` :**

```markdown
## Critical Gotchas

1. **Business Creation** : ...
2. **Multi-Tenancy Security** : ...
3. **Prisma Singleton** : ...
4. **Route Params in Next.js 16** : ...
5. **PDF Streaming** : ...
6. **Zod v4 Changes** : ...
7. **Lazy Evaluation Pattern** : ...

8. **Decimal pour Calculs Financiers** :
   Tous les champs financiers utilisent `Decimal(10,2)` pour éviter les
   erreurs d'arrondi Float. Toujours utiliser les helpers de `lib/decimal-utils.ts`
   pour les calculs, et `serializeDecimalFields()` avant de retourner des données
   depuis les Server Actions.
```

### Alertes à Configurer

**Sentry - Nouvelle alerte :**
```
Nom : "Erreur sérialisation Decimal"
Condition : Message contient "Do not know how to serialize a Decimal"
Action : Email équipe dev immédiatement
```

---

## Conclusion

### Résumé de la Migration

**Objectif :** Migrer Float → Decimal pour garantir précision financière

**Approche :** Migration SQL directe + script de recalcul

**Durée estimée :** 30-60 min (fenêtre maintenance)

**Risques :** Faibles avec tests préalables sur staging

**Rollback :** Possible en 10-15 min (restauration backup)

### Bénéfices Attendus

**Techniques :**
- ✅ Précision garantie sur tous les calculs monétaires
- ✅ Conformité pour application de facturation professionnelle
- ✅ Cohérence avec `Package.discountValue` (déjà Decimal)
- ✅ Élimination erreurs d'arrondi Float (0.1 + 0.2 ≠ 0.3)

**Business :**
- ✅ Confiance clients (calculs exacts)
- ✅ Comptabilité précise (subtotal = somme items)
- ✅ Évite litiges sur quelques centimes
- ✅ Professionnalisme (standard industrie SaaS facturation)

### Prochaines Étapes

**Avant implémentation :**
- [ ] Valider ce design avec équipe
- [ ] Planifier date maintenance (weekend/nuit recommandé)
- [ ] Communiquer aux clients (H-48h minimum)

**Implémentation :**
- [ ] Créer branche `feat/float-to-decimal-migration`
- [ ] Implémenter changements (schema, helpers, actions, components)
- [ ] Tests unitaires + E2E
- [ ] Tester sur clone production (staging)
- [ ] Merger vers main après validation

**Déploiement :**
- [ ] Suivre checklist déploiement (section 7)
- [ ] Monitoring 24h post-déploiement
- [ ] Retour d'expérience (post-mortem si problèmes)

---

**Design validé le :** 2025-12-26
**Prêt pour implémentation :** ✅ Oui
