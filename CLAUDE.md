# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

**Solkant** is a French SaaS for quote management targeting beauty salons. Built with Next.js 16 App Router, NextAuth v4, Prisma ORM, and PostgreSQL (Neon).

---

## ⚡ TL;DR - Les 7 Commandements

1. 🔴 **TOUJOURS filtrer par `businessId`** - Multi-tenancy security (voir section ci-dessous)
2. 🔴 **Utiliser `withAuth()` ou `withAuthAndValidation()`** - Jamais de pattern manuel legacy
3. 🔴 **Importer Prisma depuis `lib/prisma.ts`** - Jamais `new PrismaClient()` directement
4. 🟡 **`params` est une Promise en Next.js 16** - `const { id } = await params`
5. 🟡 **Components dans `_components/`** - Sauf si réutilisés dans 2+ features → `/components`
6. 🔵 **French locale partout** - `toLocaleDateString('fr-FR')`, `{price.toFixed(2)} €` (espace avant €)
7. 🔵 **Migrations auto sur Vercel** - Jamais `db push` ou `migrate reset` en prod

📚 **Documentation complète** : [CLAUDE-ADVANCED.md](CLAUDE-ADVANCED.md)
📊 **Analytics GA4** : [docs/analytics/CLAUDE-ANALYTICS.md](docs/analytics/CLAUDE-ANALYTICS.md)

---

## 🔴 CRITICAL: Multi-Tenant Security

### Data Model
```
User (auth) → Business (1:1) → Clients, Services, Quotes (1:many)
```

### Security Rules

**EVERY authenticated user MUST have a Business record.**
The `businessId` is stored in JWT tokens and used for data isolation.

**ALWAYS filter Prisma queries by `businessId` from session.**
Missing this filter = data leak between tenants.

```typescript
// ✅ CORRECT
const clients = await prisma.client.findMany({
  where: { businessId: session.businessId }
});

// ❌ WRONG - DATA LEAK!
const clients = await prisma.client.findMany(); // Missing businessId filter
```

**Auto-Business Creation:**
- Google OAuth: Auto-creates User + Business with retry logic (3 attempts, exponential backoff)
- Credentials: Requires manual Business creation post-registration
- Recovery: `npx tsx scripts/fix-missing-business.ts` repairs orphaned users

---

## 🔴 CRITICAL: Server Actions Pattern

All CRUD operations use Server Actions in `app/actions/` with action wrappers from `lib/action-wrapper.ts`.

### Use withAuth() or withAuthAndValidation()

**Simple actions (no input validation):**
```typescript
import { successResult } from "@/lib/action-types";

export const deleteResource = withAuth(
  async (input: { id: string }, session) => {
    await prisma.resource.delete({
      where: { id: input.id, businessId: session.businessId }
    });
    revalidatePath('/dashboard/resources');
    return successResult({ id: input.id });
  },
  "deleteResource"
);
```

**Actions with validation:**
```typescript
import { successResult } from "@/lib/action-types";

export const createResource = withAuthAndValidation(
  async (input: CreateResourceInput, session) => {
    const resource = await prisma.resource.create({
      data: { ...input, businessId: session.businessId }
    });
    revalidatePath('/dashboard/resources');
    return successResult(resource);
  },
  "createResource",
  createResourceSchema  // Zod schema from lib/validations/
);
```

**Benefits:**
- ✅ Automatic session validation + `businessId` extraction
- ✅ Consistent Zod validation with fieldErrors
- ✅ Centralized error handling + Sentry logging
- ✅ Type-safe handlers
- ✅ Input sanitization (XSS protection)
- ✅ 60% less boilerplate

**Handler Return:** Handlers MUST return `ActionResult<T>` using `successResult(data)` wrapper. The wrappers do NOT auto-convert - you must explicitly wrap your return value.

**Error Handling:** Throw errors in handler. Wrapper catches and converts to `errorResult()` with Sentry logging.

**After Mutations:** Call `revalidatePath('/path')` to refresh Next.js cache.

**Documentation:** See `/docs/action-wrapper-migration-guide.md` for migration guide and `/examples/action-wrapper-example.ts` for 10 complete examples.

---

## 🟡 Critical Gotchas

1. **Route Params in Next.js 16**: `params` is a Promise
   ```typescript
   // ✅ CORRECT
   const { id } = await params;

   // ❌ WRONG
   const { id } = params; // Type error
   ```

2. **Component Colocation**: Place in `_components/` when used in ONE feature only. Move to `/components` only when reused across 2+ features.

3. **Zod v4**: Using `zod@4.1.13` - note `z.string().cuid()` for ID validation (not `.uuid()`)

---

## 📚 Extended Documentation

- **[CLAUDE-ADVANCED.md](CLAUDE-ADVANCED.md)** - Full commands, TypeScript patterns, adding new resources, PDF generation
- **[docs/analytics/CLAUDE-ANALYTICS.md](docs/analytics/CLAUDE-ANALYTICS.md)** - Complete GA4 setup, events, dimensions, KPIs
- **[docs/secure-migrations-workflow.md](docs/secure-migrations-workflow.md)** - Migration safety protocols
