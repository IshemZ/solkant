# Copilot Instructions - Solkant

**Solkant** est un SaaS français de gestion de devis pour instituts de beauté. Next.js 16 App Router, NextAuth v4, Prisma ORM, PostgreSQL (Neon).

## 🔴 Règles Critiques

### Multi-Tenant Security

Chaque utilisateur a un Business (1:1). **TOUJOURS filtrer par `businessId`** dans les queries Prisma :

```typescript
// ✅ CORRECT
const clients = await prisma.client.findMany({
  where: { businessId: session.businessId },
});
// ❌ FUITE DE DONNÉES : findMany() sans businessId
```

### Server Actions (`app/actions/`)

Utiliser les wrappers de [lib/action-wrapper.ts](lib/action-wrapper.ts) :

```typescript
import { successResult } from "@/lib/action-types";

// Sans validation
export const deleteResource = withAuth(
  async (input: { id: string }, session) => {
    await prisma.resource.delete({
      where: { id: input.id, businessId: session.businessId },
    });
    revalidatePath("/dashboard/resources");
    return successResult({ id: input.id });
  },
  "deleteResource"
);

// Avec validation Zod
export const createResource = withAuthAndValidation(
  handler,
  "createResource",
  createResourceSchema
);
```

- Handlers retournent `successResult(data)` - jamais de return direct
- Schémas Zod dans [lib/validations/](lib/validations/)

### Imports

```typescript
import { prisma } from "@/lib/prisma"; // ✅ Jamais new PrismaClient()
import { authOptions } from "@/lib/auth"; // ✅ Utiliser @/ pour paths absolus
```

## 🟡 Conventions Next.js 16

- **Route params** : `const { id } = await params;` (params est une Promise)
- **Components** : Placer dans `_components/` si utilisés dans UNE feature ; `/components/` si partagés entre 2+ features
- **Structure routes** : `app/(dashboard)/dashboard/[resource]/` avec `page.tsx`, `loading.tsx`, `nouveau/`, `[id]/`

## 📍 Locale Française

```typescript
date.toLocaleDateString(
  "fr-FR"
) // "01/01/2026"
`${price.toFixed(2)} €`; // "99.99 €" (espace avant €)
```

## 🧪 Tests

```bash
npm test                    # Vitest watch mode
npm run test:run            # Run once
npm run test:multi-tenant   # Tests isolation multi-tenant (CRITIQUE)
npm run test:e2e            # Playwright E2E
npm run test:coverage       # Couverture >80%
```

## 🗄️ Database

```bash
npx prisma migrate dev      # Créer migration (dev)
npx prisma generate         # Régénérer client après schema.prisma
npx prisma studio           # GUI database
# Prod : migrations auto sur Vercel - jamais db push/reset
```

## 📁 Structure Clé

- [app/actions/](app/actions/) - Server actions CRUD
- [lib/validations/](lib/validations/) - Schémas Zod par ressource
- [lib/action-wrapper.ts](lib/action-wrapper.ts) - Wrappers auth + validation
- [prisma/schema.prisma](prisma/schema.prisma) - Modèles avec relations Business
- [CLAUDE-ADVANCED.md](CLAUDE-ADVANCED.md) - Guide complet ajout nouvelle ressource
