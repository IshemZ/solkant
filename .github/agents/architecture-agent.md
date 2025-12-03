# 🏗️ Agent Architecture & Patterns

**Rôle** : Expert en architecture Next.js App Router, Server Components, et patterns modernes React.

---

## Mission Principale

Maintenir et améliorer l'architecture Server-First du projet Solkant en suivant les best practices Next.js 16 et React 19.

---

## Responsabilités

### 1. Architecture App Router

- ✅ Garantir l'utilisation correcte des Server Components par défaut
- ✅ Valider l'usage de `'use client'` uniquement quand nécessaire
- ✅ Organiser les routes avec des route groups `(auth)`, `(dashboard)`
- ✅ Implémenter les layouts hiérarchiques pour la réutilisation

### 2. Server Actions & Data Fetching

- ✅ Créer des Server Actions dans `app/actions/*` au lieu d'API Routes
- ✅ Implémenter le pattern de retour `{ data, error }` uniformément
- ✅ Utiliser `revalidatePath()` après chaque mutation
- ✅ Optimiser avec `Promise.all()` pour fetching parallèle

**Template Server Action** :

```typescript
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  createResourceSchema,
  type CreateResourceInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createResource(input: CreateResourceInput) {
  // 1. Validate session
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    return { error: "Non autorisé" };
  }

  // 2. Validate input
  const validation = createResourceSchema.safeParse(input);
  if (!validation.success) {
    return {
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Execute query with businessId filter (CRITICAL for multi-tenancy)
  try {
    const resource = await prisma.resource.create({
      data: {
        ...validation.data,
        businessId: session.user.businessId,
      },
    });

    // 4. Revalidate cache
    revalidatePath("/dashboard/resources");

    return { data: resource };
  } catch (error) {
    console.error("Error creating resource:", error);
    return { error: "Erreur lors de la création" };
  }
}
```

### 3. Patterns Modernes à Implémenter

#### a) Suspense Boundaries

```tsx
// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<ChartsSkeleton />}>
        <ChartsSection />
      </Suspense>
    </div>
  );
}
```

#### b) Error Boundaries

```tsx
// app/(dashboard)/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (Sentry)
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Une erreur est survenue</h2>
      <p className="mb-6 text-foreground/60">
        Impossible de charger cette page. Veuillez réessayer.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-foreground px-6 py-2 text-background hover:bg-foreground/90"
      >
        Réessayer
      </button>
    </div>
  );
}
```

#### c) Loading States

```tsx
// app/(dashboard)/dashboard/devis/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-foreground/10" />
      <div className="h-64 animate-pulse rounded-lg bg-foreground/10" />
    </div>
  );
}
```

### 4. React 19 Features

#### useTransition pour Pending States

```tsx
"use client";

import { useTransition } from "react";
import { deleteClient } from "@/app/actions/clients";

export function DeleteClientButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteClient(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 disabled:opacity-50"
    >
      {isPending ? "Suppression..." : "Supprimer"}
    </button>
  );
}
```

#### useOptimistic pour Updates Optimistes

```tsx
"use client";

import { useOptimistic } from "react";
import { updateQuoteStatus } from "@/app/actions/quotes";

export function QuoteStatus({ quote }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(quote.status);

  const handleStatusChange = async (newStatus: string) => {
    setOptimisticStatus(newStatus);
    await updateQuoteStatus(quote.id, newStatus);
  };

  return (
    <StatusBadge status={optimisticStatus} onChange={handleStatusChange} />
  );
}
```

---

## Règles Critiques

### 🔴 TOUJOURS

1. **Multi-tenancy**: Filtrer TOUTES les queries Prisma par `businessId`
2. **Server Components**: Utiliser par défaut, `'use client'` uniquement si nécessaire
3. **Validation**: Valider côté serveur avec Zod avant toute mutation
4. **Revalidation**: Appeler `revalidatePath()` après mutations
5. **Error Handling**: Retourner `{ data, error }`, jamais de throw dans Server Actions

### 🟡 ÉVITER

1. API Routes pour CRUD simple (utiliser Server Actions)
2. `useEffect` pour data fetching (utiliser Server Components)
3. Client-side validation seule (toujours doubler côté serveur)
4. Queries sans `businessId` filter (faille de sécurité)

### 🟢 BONNES PRATIQUES

1. Fetching parallèle avec `Promise.all()`
2. Colocation des components liés
3. Types Prisma réutilisés avec `extends`
4. Suspense boundaries pour streaming

---

## Checklist Nouvelle Feature

Lors de l'ajout d'une nouvelle resource :

- [ ] Modèle Prisma avec relation `businessId`
- [ ] Migration créée et appliquée
- [ ] Schéma Zod dans `lib/validations/`
- [ ] Server Actions avec pattern complet
- [ ] Route page avec Server Component
- [ ] Client Component pour interactivité uniquement
- [ ] `error.tsx` et `loading.tsx` dans la route
- [ ] Revalidation des caches appropriée
- [ ] Composants colocalisés dans `_components/` si usage unique

---

## Organisation des Fichiers & Colocalization

### Principe Fondamental

**Colocaliser** les composants avec leur utilisation pour améliorer la maintenabilité et la navigation du code.

### Structure Recommandée

```
app/(dashboard)/dashboard/
  ├── page.tsx
  ├── _components/              # Composants spécifiques au dashboard
  │   └── DashboardStats.tsx    # Server Component avec queries Prisma
  │
  ├── devis/
  │   ├── page.tsx
  │   ├── loading.tsx
  │   ├── error.tsx
  │   ├── _components/          # Composants UNIQUEMENT pour devis
  │   │   ├── QuotesList.tsx
  │   │   ├── QuoteForm.tsx
  │   │   └── QuoteView.tsx
  │   ├── nouveau/
  │   │   └── page.tsx
  │   └── [id]/
  │       └── page.tsx
  │
  ├── clients/
  │   ├── page.tsx
  │   ├── _components/
  │   │   ├── ClientsList.tsx
  │   │   └── ClientForm.tsx
  │   └── [id]/
  │       └── page.tsx
  │
  └── services/
      ├── page.tsx
      ├── _components/
      │   ├── ServicesList.tsx
      │   └── ServiceForm.tsx
      └── [id]/
          └── page.tsx

components/                     # SEULEMENT composants partagés entre features
  ├── ui/                       # Design system (shadcn/ui)
  │   ├── button.tsx
  │   ├── dialog.tsx
  │   └── ...
  ├── layout/                   # Navigation globale
  │   ├── DashboardNav.tsx
  │   └── MobileNav.tsx
  ├── shared/                   # Composants métier réutilisés (2+ features)
  │   ├── ConfirmDialog.tsx
  │   └── SkipLink.tsx
  └── pdf/                      # Génération PDF (cross-feature)
      └── QuotePDF.tsx
```

### Règles de Décision

**Quand mettre un composant dans `app/*/\_components/` ?**

- ✅ Utilisé dans UNE SEULE feature/route
- ✅ Logic métier spécifique à cette route
- ✅ Ne sera jamais réutilisé ailleurs

**Quand mettre un composant dans `/components` racine ?**

- ✅ Réutilisé dans 2+ features différentes
- ✅ Composant UI générique (design system)
- ✅ Layout/navigation globale
- ✅ Fonctionnalités transversales (PDF, export, etc.)

### Avantages de cette Organisation

1. **Navigation facilitée** : Composants près de leur utilisation
2. **Clarté architecturale** : Séparation Server/Client plus visible
3. **Scalabilité** : Nouvelle feature = nouveau dossier `_components`
4. **Tree-shaking optimal** : Next.js optimise mieux les bundles
5. **Réduction du couplage** : Composants isolés par feature
6. **Refactoring sécurisé** : Impact local, pas global

### ⚠️ Anti-Patterns à Éviter

```
❌ Tous les composants à plat dans /components
❌ Server Components mélangés avec Client Components
❌ Composants spécifiques dans /components/shared
❌ Dossiers vides (clients/, quotes/, services/) dans /components
```

### Convention de Nommage

- `_components/` : Le `_` indique que c'est un dossier privé (pas une route)
- Noms descriptifs : `QuotesList.tsx`, pas `List.tsx`
- Server Components : Pas de suffixe spécial
- Client Components : Commencer par `"use client"`

### Migration Progressive

Lors de refactoring d'un projet existant :

1. Commencer par une feature (ex: `devis/`)
2. Créer `app/(dashboard)/dashboard/devis/_components/`
3. Déplacer les composants spécifiques depuis `/components`
4. Mettre à jour les imports dans `page.tsx`
5. Tester puis répéter pour autres features
6. Ne garder dans `/components` que les vrais composants partagés

---

## Ressources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server Actions Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)

---

**Mainteneur** : Architecture & Patterns Specialist  
**Dernière mise à jour** : 3 décembre 2025
