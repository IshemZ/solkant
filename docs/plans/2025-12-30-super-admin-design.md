# Design : Accès Super Admin Plateforme Solkant

**Date :** 2025-12-30
**Status :** Validé
**Implémentation :** Approche Progressive (Phases 1+2, puis Phase 3)

---

## Vue d'Ensemble

Création d'un accès super admin pour gérer tous les utilisateurs/businesses de la plateforme Solkant. Le super admin peut :

- Voir la liste de tous les businesses inscrits
- Consulter les détails de chaque business
- Modifier les données d'un business (nom, adresse, abonnement)
- Suspendre/activer un business
- Supprimer un business
- Se connecter "en tant que" un business pour du support (Phase 3)

---

## Périmètre

### Phase 1+2 : Fondations + Actions Avancées (~80% de la valeur)
- ✅ Modèle de données avec role USER/SUPER_ADMIN
- ✅ Script de promotion super admin
- ✅ Interface admin `/admin` avec liste des businesses
- ✅ Actions CRUD complètes (lecture, modification, suspension, suppression)
- ✅ Navigation entre mode admin et dashboard normal

### Phase 3 : Impersonation (séparée)
- 🔜 Se connecter "en tant que" un business
- 🔜 Banner visuel "Mode Super Admin - Connecté en tant que [Business]"
- 🔜 Bouton "Quitter l'impersonation"

---

## Architecture & Modèle de Données

### Modifications Prisma Schema

**Ajout de l'enum Role :**
```prisma
enum UserRole {
  USER
  SUPER_ADMIN
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  role          UserRole  @default(USER)  // ← Nouveau champ
  emailVerified DateTime?
  password      String?
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  tokenExpiry   DateTime?
  verificationToken String? @unique
  accounts      Account[]
  business      Business?
  sessions      Session[]
}
```

**Migration progressive :**
- Migration Prisma ajoute le champ avec `@default(USER)`
- Tous les users existants deviennent automatiquement `USER`
- Aucune donnée perdue, backwards compatible

### Extension des Types NextAuth

**Modification de `types/next-auth.d.ts` :**
```typescript
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole              // ← Nouveau
      businessId?: string | null
      subscriptionStatus?: string | null
      isPro?: boolean | null
      impersonatingBusinessId?: string | null  // ← Pour Phase 3
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    role: UserRole              // ← Nouveau
    businessId?: string | null
    subscriptionStatus?: string | null
    isPro?: boolean | null
    impersonatingBusinessId?: string | null  // ← Pour Phase 3
  }
}
```

### Callbacks NextAuth (`lib/auth.ts`)

**Enrichir le callback JWT :**
```typescript
callbacks: {
  async jwt({ token, user, trigger, session }) {
    if (user) {
      token.id = user.id;
      token.email = user.email;

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { business: true }
      });

      token.role = dbUser?.role || 'USER';  // ← Nouveau
      token.businessId = dbUser?.business?.id;
      token.subscriptionStatus = dbUser?.business?.subscriptionStatus;
      token.isPro = dbUser?.business?.isPro;
    }

    // ... reste du code
    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id;
    session.user.email = token.email;
    session.user.role = token.role;  // ← Nouveau
    session.user.businessId = token.businessId;
    session.user.subscriptionStatus = token.subscriptionStatus;
    session.user.isPro = token.isPro;
    return session;
  }
}
```

---

## Helpers d'Authentification & Action Wrappers

### Nouveau Helper de Validation

**Ajouter dans `lib/auth-helpers.ts` :**
```typescript
export async function validateSuperAdmin(): Promise<ValidatedSession | AuthError> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Non authentifié" };
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    return { error: "Accès interdit - Super Admin requis" };
  }

  return {
    userId: session.user.id,
    userEmail: session.user.email,
    businessId: session.user.businessId || '', // Optionnel pour super admin
  };
}
```

### Nouveau Action Wrapper

**Ajouter dans `lib/action-wrapper.ts` :**
```typescript
export function withSuperAdminAuth<TInput, TOutput>(
  handler: (input: TInput, session: ValidatedSession) => Promise<ActionResult<TOutput>>,
  actionName: string
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    const validation = await validateSuperAdmin();

    if ('error' in validation) {
      return errorResult(validation.error);
    }

    try {
      return await handler(input, validation);
    } catch (error) {
      console.error(`[${actionName}] Error:`, error);
      Sentry.captureException(error, {
        tags: { action: actionName, type: 'super_admin_action' },
        user: { id: validation.userId, email: validation.userEmail }
      });

      const message = error instanceof Error ? error.message : 'Erreur interne';
      return errorResult(message);
    }
  };
}
```

**Pattern identique aux wrappers existants :**
- Validation automatique du role super admin
- Type-safe
- Logging Sentry centralisé
- Réutilisable pour toutes les actions admin

---

## Structure des Routes & Protection

### Organisation des Routes

```
app/
├── (admin)/
│   ├── layout.tsx          // Layout super admin avec protection
│   └── admin/
│       ├── page.tsx        // Dashboard admin (liste businesses)
│       ├── businesses/
│       │   └── [id]/
│       │       └── page.tsx  // Détails d'un business
│       └── _components/
│           ├── business-list.tsx
│           ├── business-stats.tsx
│           ├── business-actions.tsx
│           └── business-edit-form.tsx
```

### Layout Protection

**`app/(admin)/layout.tsx` :**
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "./_components/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Pas connecté → login
  if (!session) {
    redirect("/login");
  }

  // Pas super admin → dashboard normal
  if (session.user.role !== 'SUPER_ADMIN') {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav session={session} />
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  );
}
```

### Navigation entre Modes

**Menu super admin (`_components/admin-nav.tsx`) :**
- Logo "Solkant Admin" (distinct du logo business)
- Navigation : Dashboard, Businesses, Statistiques
- Si super admin a un businessId → lien "Mon Business" vers `/dashboard`
- Bouton déconnexion

**Menu dashboard normal (modifier `app/(dashboard)/_components/sidebar.tsx`) :**
```typescript
{session.user.role === 'SUPER_ADMIN' && (
  <Link href="/admin" className="flex items-center gap-2 text-sm">
    <Shield className="h-4 w-4" />
    Admin Plateforme
  </Link>
)}
```

---

## Server Actions pour Opérations Admin

**Créer `app/actions/admin.ts` :**

### 1. Lister tous les businesses

```typescript
import { withSuperAdminAuth } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";
import prisma from "@/lib/prisma";

export const getAllBusinesses = withSuperAdminAuth(
  async (_input: void, _session) => {
    const businesses = await prisma.business.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            clients: true,
            quotes: true,
            services: true,
            packages: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResult(businesses);
  },
  "getAllBusinesses"
);
```

**Note importante :** Pas de filtre `businessId` - le super admin voit **tous** les businesses.

### 2. Obtenir les détails d'un business

```typescript
export const getBusinessDetails = withSuperAdminAuth(
  async (input: { businessId: string }, _session) => {
    const business = await prisma.business.findUnique({
      where: { id: input.businessId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            createdAt: true,
            image: true
          }
        },
        clients: { select: { id: true, firstName: true, lastName: true } },
        quotes: { select: { id: true, status: true, totalPrice: true } },
        services: { select: { id: true, name: true } },
        packages: { select: { id: true, name: true } }
      }
    });

    if (!business) {
      throw new Error("Business introuvable");
    }

    return successResult(business);
  },
  "getBusinessDetails"
);
```

### 3. Mettre à jour un business

```typescript
import { sanitizeInput } from "@/lib/action-wrapper";
import { revalidatePath } from "next/cache";

export const updateBusinessAsAdmin = withSuperAdminAuth(
  async (input: {
    businessId: string;
    data: {
      name?: string;
      address?: string;
      city?: string;
      postalCode?: string;
      phone?: string;
      subscriptionStatus?: string;
      isPro?: boolean;
    }
  }, _session) => {
    const sanitized = sanitizeInput(input.data);

    const business = await prisma.business.update({
      where: { id: input.businessId },
      data: sanitized
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/businesses/${input.businessId}`);

    return successResult(business);
  },
  "updateBusinessAsAdmin"
);
```

### 4. Suspendre/Activer un business

```typescript
export const toggleBusinessStatus = withSuperAdminAuth(
  async (input: {
    businessId: string;
    suspended: boolean
  }, _session) => {
    const business = await prisma.business.update({
      where: { id: input.businessId },
      data: {
        subscriptionStatus: input.suspended ? 'CANCELED' : 'ACTIVE'
      }
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/businesses/${input.businessId}`);

    return successResult(business);
  },
  "toggleBusinessStatus"
);
```

### 5. Supprimer un business

```typescript
export const deleteBusinessAsAdmin = withSuperAdminAuth(
  async (input: { businessId: string }, _session) => {
    // Cascade delete configuré dans schema.prisma
    // Supprime automatiquement : clients, quotes, services, packages
    await prisma.business.delete({
      where: { id: input.businessId }
    });

    revalidatePath('/admin');

    return successResult({ id: input.businessId });
  },
  "deleteBusinessAsAdmin"
);
```

**Pattern clé :** Toutes les actions utilisent `withSuperAdminAuth` et peuvent manipuler **n'importe quel** business (pas de restriction au `session.businessId`).

---

## Interface Utilisateur Admin

### Page Dashboard Admin

**`app/(admin)/admin/page.tsx` :**
```typescript
import { getAllBusinesses } from "@/app/actions/admin";
import { BusinessStats } from "./_components/business-stats";
import { BusinessList } from "./_components/business-list";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const result = await getAllBusinesses();

  if (!result.success) {
    return (
      <div className="text-red-600">
        Erreur : {result.error}
      </div>
    );
  }

  const businesses = result.data;

  // Statistiques calculées côté serveur
  const stats = {
    total: businesses.length,
    active: businesses.filter(b => b.subscriptionStatus === 'ACTIVE').length,
    trial: businesses.filter(b => b.subscriptionStatus === 'TRIAL').length,
    canceled: businesses.filter(b => b.subscriptionStatus === 'CANCELED').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Administration Solkant</h1>
        <p className="text-gray-600">Gestion des businesses et utilisateurs</p>
      </div>

      <BusinessStats stats={stats} />
      <BusinessList businesses={businesses} />
    </div>
  );
}
```

### Composant Liste Businesses

**`_components/business-list.tsx` (Client Component) :**
- Table avec colonnes : Nom, Email, Statut, Clients, Devis, Date création
- Filtres par statut (ACTIVE, TRIAL, CANCELED, etc.)
- Recherche par nom/email (state local)
- Actions par ligne :
  - Voir détails (lien vers `/admin/businesses/[id]`)
  - Suspendre/Activer (dropdown)
  - Supprimer (avec confirmation)

**Utilisation shadcn/ui :**
- `<Table>` pour l'affichage
- `<Badge>` pour le statut (vert=ACTIVE, orange=TRIAL, rouge=CANCELED)
- `<DropdownMenu>` pour les actions
- `<AlertDialog>` pour confirmer suppressions
- `<Input>` pour la recherche

### Page Détails Business

**`app/(admin)/admin/businesses/[id]/page.tsx` :**
```typescript
import { getBusinessDetails } from "@/app/actions/admin";
import { BusinessEditForm } from "../../_components/business-edit-form";
import { BusinessDangerZone } from "../../_components/business-danger-zone";

export const dynamic = "force-dynamic";

export default async function BusinessDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getBusinessDetails({ businessId: id });

  if (!result.success) {
    return <div className="text-red-600">Erreur : {result.error}</div>;
  }

  const business = result.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <p className="text-gray-600">{business.user.email}</p>
      </div>

      {/* Formulaire éditable */}
      <BusinessEditForm business={business} />

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Clients</p>
          <p className="text-2xl font-bold">{business._count.clients}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Devis</p>
          <p className="text-2xl font-bold">{business._count.quotes}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Services</p>
          <p className="text-2xl font-bold">{business._count.services}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-600">Packages</p>
          <p className="text-2xl font-bold">{business._count.packages}</p>
        </div>
      </div>

      {/* Actions dangereuses */}
      <BusinessDangerZone businessId={business.id} businessName={business.name} />
    </div>
  );
}
```

### Formulaire Édition

**`_components/business-edit-form.tsx` (Client Component) :**
- Utilise `useActionState` pour gérer le submit
- Appelle `updateBusinessAsAdmin`
- Champs : name, address, city, postalCode, phone, subscriptionStatus, isPro
- Validation côté client (optionnelle, réutiliser les schemas Zod existants)
- Affichage des erreurs fieldErrors

### Zone Danger

**`_components/business-danger-zone.tsx` (Client Component) :**
- Bouton "Suspendre Business" avec `AlertDialog`
- Bouton "Supprimer Business" avec confirmation stricte :
  - Input "Tapez DELETE pour confirmer"
  - Disabled tant que l'input n'est pas correct
  - Appelle `deleteBusinessAsAdmin` puis redirect vers `/admin`

---

## Script de Promotion & Sécurité

### Script de Promotion Super Admin

**Créer `scripts/make-super-admin.ts` :**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeSuperAdmin(email: string) {
  console.log(`🔍 Recherche du user avec email: ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`❌ User avec email ${email} introuvable`);
    console.log('\n💡 Vérifiez que le user existe dans la base de données.');
    process.exit(1);
  }

  if (user.role === 'SUPER_ADMIN') {
    console.log(`✅ ${email} est déjà super admin`);
    return;
  }

  console.log(`📝 Promotion de ${email} en SUPER_ADMIN...`);

  await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' }
  });

  console.log(`✅ ${email} promu SUPER_ADMIN avec succès`);
  console.log('\n🔐 Déconnectez-vous et reconnectez-vous pour que les changements prennent effet.');
}

const email = process.argv[2];

if (!email) {
  console.error('❌ Email manquant');
  console.log('\nUsage: npx tsx scripts/make-super-admin.ts <email>');
  console.log('Exemple: npx tsx scripts/make-super-admin.ts admin@solkant.com');
  process.exit(1);
}

makeSuperAdmin(email)
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

**Utilisation :**
```bash
npx tsx scripts/make-super-admin.ts admin@solkant.com
```

### Mesures de Sécurité

**1. Audit Trail :**
- Toutes les actions admin sont loggées dans Sentry avec `severity: 'warning'`
- Tags captés : `{ action, adminEmail, targetBusinessId, timestamp }`
- Permet de tracer qui a fait quoi et quand

**Pattern d'audit (déjà dans `withSuperAdminAuth`) :**
```typescript
Sentry.captureException(error, {
  tags: { action: actionName, type: 'super_admin_action' },
  user: { id: validation.userId, email: validation.userEmail }
});
```

**2. Double Confirmation pour Suppressions :**
- `AlertDialog` avec input "Tapez DELETE pour confirmer"
- Bouton submit disabled tant que l'input !== "DELETE"
- Évite les suppressions accidentelles

**3. Variable d'Environnement Backup (optionnel) :**
```env
SUPER_ADMIN_EMAILS=admin@solkant.com,backup@solkant.com
```

**Utilisation :** Vérification additionnelle dans `validateSuperAdmin()` si besoin de bloquer temporairement tous les admins sauf ceux-ci.

**4. Rate Limiting (future amélioration) :**
- Middleware pour limiter les requêtes sur `/admin/*` (ex: 100 req/minute)
- Protège contre abus même si credentials compromis

---

## Migration & Déploiement

### Ordre d'Exécution sur Production

**1. Merger la PR :**
- Vercel détecte le changement de schema Prisma
- Auto-run `prisma migrate deploy` pendant le build
- Ajoute la colonne `role` avec default `USER`

**2. Après le deploy, promouvoir le premier admin :**
```bash
# Sur Vercel, via terminal
npx tsx scripts/make-super-admin.ts votre@email.com
```

**Alternative (si accès direct à la DB) :**
```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'votre@email.com';
```

**3. Vérification :**
- Se déconnecter
- Se reconnecter (pour refresh le JWT avec nouveau role)
- Naviguer vers `/admin`
- Vérifier l'accès et les actions

**4. Promouvoir d'autres admins (optionnel) :**
- Via script ou via future interface admin (Phase future)

### Rollback Plan

**Si problème critique :**
1. Revert le PR sur GitHub
2. Vercel redeploy automatiquement
3. La colonne `role` reste (pas de perte de données)
4. Réessayer après fix

**Migration Prisma générée :**
```sql
-- migration.sql
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';
```

**Safe rollback :** Supprimer la colonne nécessite migration manuelle, mais pas urgente si feature désactivée.

---

## Tests Recommandés

### Tests Unitaires (`__tests__/admin.test.ts`)

**1. Test du wrapper `withSuperAdminAuth` :**
- ✅ User avec role SUPER_ADMIN → succès
- ❌ User avec role USER → error "Accès interdit"
- ❌ User non connecté → error "Non authentifié"

**2. Test des actions :**
- `getAllBusinesses` retourne tous les businesses (pas de filtre businessId)
- `updateBusinessAsAdmin` modifie le bon business
- `deleteBusinessAsAdmin` supprime avec cascade

### Tests E2E (Playwright/Cypress)

**1. Test du flow complet :**
- Login en tant que super admin
- Navigation vers `/admin`
- Voir la liste des businesses
- Cliquer sur un business → détails
- Modifier le nom → sauvegarde → vérification
- Suspendre → vérification du statut
- Supprimer avec confirmation

**2. Test de protection :**
- Login en tant que USER normal
- Tentative d'accès à `/admin` → redirect vers `/dashboard`

---

## Checklist Implémentation Phase 1+2

- [ ] **Prisma Schema**
  - [ ] Ajouter enum `UserRole`
  - [ ] Ajouter champ `role` sur `User`
  - [ ] Générer et appliquer migration

- [ ] **Types NextAuth**
  - [ ] Étendre `Session` interface
  - [ ] Étendre `JWT` interface
  - [ ] Modifier callbacks dans `lib/auth.ts`

- [ ] **Auth Helpers**
  - [ ] Créer `validateSuperAdmin()` dans `lib/auth-helpers.ts`
  - [ ] Créer `withSuperAdminAuth()` dans `lib/action-wrapper.ts`

- [ ] **Server Actions**
  - [ ] Créer `app/actions/admin.ts`
  - [ ] Implémenter `getAllBusinesses`
  - [ ] Implémenter `getBusinessDetails`
  - [ ] Implémenter `updateBusinessAsAdmin`
  - [ ] Implémenter `toggleBusinessStatus`
  - [ ] Implémenter `deleteBusinessAsAdmin`

- [ ] **Routes & Layout**
  - [ ] Créer `app/(admin)/layout.tsx`
  - [ ] Créer `app/(admin)/admin/page.tsx`
  - [ ] Créer `app/(admin)/admin/businesses/[id]/page.tsx`

- [ ] **Components**
  - [ ] `_components/admin-nav.tsx`
  - [ ] `_components/business-stats.tsx`
  - [ ] `_components/business-list.tsx`
  - [ ] `_components/business-edit-form.tsx`
  - [ ] `_components/business-danger-zone.tsx`

- [ ] **Navigation**
  - [ ] Ajouter lien "Admin Plateforme" dans sidebar dashboard si role = SUPER_ADMIN
  - [ ] Ajouter lien "Mon Business" dans admin nav si businessId existe

- [ ] **Script**
  - [ ] Créer `scripts/make-super-admin.ts`
  - [ ] Tester en local

- [ ] **Tests**
  - [ ] Tests unitaires pour `withSuperAdminAuth`
  - [ ] Tests E2E pour flow super admin

- [ ] **Déploiement**
  - [ ] Merger PR
  - [ ] Vérifier auto-migration Vercel
  - [ ] Run script de promotion en production
  - [ ] Tester l'accès `/admin` en production

---

## Checklist Implémentation Phase 3 (Future)

- [ ] **Impersonation Backend**
  - [ ] Ajouter champ `impersonatingBusinessId` dans JWT/Session
  - [ ] Créer action `startImpersonation(businessId)`
  - [ ] Créer action `stopImpersonation()`
  - [ ] Modifier `validateSessionWithEmail()` pour utiliser `impersonatingBusinessId` si présent

- [ ] **Impersonation UI**
  - [ ] Bouton "Se connecter en tant que" dans business details
  - [ ] Banner rouge sticky en haut "⚠️ Mode Super Admin - Connecté en tant que [Business]"
  - [ ] Bouton "Quitter l'impersonation" dans banner
  - [ ] Redirect vers `/dashboard` après impersonation start

- [ ] **Sécurité Impersonation**
  - [ ] Logger dans Sentry chaque start/stop impersonation
  - [ ] Timeout automatique après 1h (optionnel)
  - [ ] Double confirmation avant start impersonation

---

## Notes Techniques

### Multi-Tenancy Security

**Le super admin BYPASS le filtre `businessId` :**
- Les actions normales filtrent par `session.businessId`
- Les actions admin n'ont PAS ce filtre
- Permet de voir/modifier tous les businesses

**Pattern actuel (USER normal) :**
```typescript
const clients = await prisma.client.findMany({
  where: { businessId: session.businessId }  // ← Filtre obligatoire
});
```

**Pattern admin (SUPER_ADMIN) :**
```typescript
const businesses = await prisma.business.findMany({
  // Pas de filtre businessId → voit tout
});
```

### French Locale

- Toutes les dates : `toLocaleDateString('fr-FR')`
- Prix : `{price.toFixed(2)} €` (espace avant €)
- Statuts : EN (ACTIVE), FR (Actif) dans l'UI

### Subscription Status Values

```typescript
enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELED
  EXPIRED
}
```

**Mapping UI :**
- TRIAL → Badge orange "Essai"
- ACTIVE → Badge vert "Actif"
- PAST_DUE → Badge jaune "Impayé"
- CANCELED → Badge rouge "Annulé"
- EXPIRED → Badge gris "Expiré"

---

## Améliorations Futures (Hors Scope)

- [ ] Dashboard analytics admin (graphiques d'inscriptions, chiffre d'affaires, etc.)
- [ ] Export CSV de la liste des businesses
- [ ] Envoi d'emails aux businesses (annonces, notifications)
- [ ] Système de permissions granulaires (modérateurs, support tier 1/2)
- [ ] Logs d'actions admin dans une table dédiée (audit trail en DB)
- [ ] Filtres avancés (date d'inscription, statut subscription, nombre de clients)

---

## Conclusion

Ce design couvre toutes les fonctionnalités demandées en Phase 1+2 :
- ✅ Role-based access avec USER/SUPER_ADMIN
- ✅ Interface admin `/admin` complète
- ✅ Actions CRUD sur tous les businesses
- ✅ Sécurité via wrappers et validations
- ✅ Script de promotion super admin
- ✅ Navigation claire entre modes

L'implémentation suit les patterns existants (action wrappers, Server Components, shadcn/ui) pour garantir cohérence et maintenabilité.

Phase 3 (impersonation) peut être ajoutée plus tard sans refactoring majeur.
