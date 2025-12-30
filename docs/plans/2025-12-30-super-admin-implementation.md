# Super Admin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implémenter l'accès super admin plateforme Solkant (Phases 1+2) pour gérer tous les businesses

**Architecture:** Role-based access avec enum UserRole (USER/SUPER_ADMIN), action wrappers pour validation, interface admin `/admin` séparée avec protection au niveau layout, server actions sans filtre businessId pour accès global

**Tech Stack:** Next.js 16 App Router, Prisma ORM, NextAuth v4 JWT, shadcn/ui, TypeScript, Zod validation

---

## Task 1: Prisma Schema - Add UserRole Enum

**Files:**
- Modify: `prisma/schema.prisma:11-27`

**Step 1: Add UserRole enum and role field to User model**

Modify the schema to add the enum before the User model and the role field inside User:

```prisma
enum UserRole {
  USER
  SUPER_ADMIN
}

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  role              UserRole  @default(USER)
  emailVerified     DateTime?
  password          String?
  name              String?
  image             String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  tokenExpiry       DateTime?
  verificationToken String?   @unique
  accounts          Account[]
  business          Business?
  sessions          Session[]

  @@map("users")
}
```

**Step 2: Generate Prisma migration**

Run: `npx prisma migrate dev --name add_user_role`

Expected: Migration file created in `prisma/migrations/` with SQL to add enum and column

**Step 3: Verify migration**

Run: `npx prisma migrate status`

Expected: "Database is up to date"

**Step 4: Generate Prisma Client**

Run: `npx prisma generate`

Expected: "Generated Prisma Client"

**Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add UserRole enum and role field to User model"
```

---

## Task 2: NextAuth Types - Extend Session and JWT

**Files:**
- Modify: `types/next-auth.d.ts`

**Step 1: Update type definitions**

Replace entire file content:

```typescript
import 'next-auth'
import { UserRole } from '@prisma/client'

/**
 * Extend NextAuth types to include custom user properties
 */

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      businessId?: string | null
      subscriptionStatus?: string | null
      isPro?: boolean | null
      impersonatingBusinessId?: string | null  // For Phase 3
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role?: UserRole
    businessId?: string | null
    subscriptionStatus?: string | null
    isPro?: boolean | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    provider?: string
    role: UserRole
    businessId?: string | null
    subscriptionStatus?: string | null
    isPro?: boolean | null
    impersonatingBusinessId?: string | null  // For Phase 3
  }
}
```

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 3: Commit**

```bash
git add types/next-auth.d.ts
git commit -m "feat: extend NextAuth types with UserRole"
```

---

## Task 3: Update NextAuth Callbacks

**Files:**
- Modify: `lib/auth.ts:233-286`

**Step 1: Update jwt callback to include role**

Replace the jwt callback (lines 233-276):

```typescript
async jwt({ token, user, account }) {
  try {
    // Initial sign in
    if (user) {
      token.id = user.id;

      // Fetch businessId, subscription info, and role for the user
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          role: true,
          business: {
            select: {
              id: true,
              subscriptionStatus: true,
              isPro: true,
            },
          },
        },
      });

      token.role = dbUser?.role || 'USER';
      token.businessId = dbUser?.business?.id || null;
      token.subscriptionStatus =
        dbUser?.business?.subscriptionStatus || null;
      token.isPro = dbUser?.business?.isPro || null;

      if (!token.businessId && token.role !== 'SUPER_ADMIN') {
        console.warn(
          "[JWT Callback] ⚠️ Aucun businessId trouvé pour user:",
          user.id
        );
      }
    }

    // OAuth sign in
    if (account?.provider === "google") {
      token.provider = "google";
    }

    return token;
  } catch (error) {
    console.error("[JWT Callback] ERREUR:", error);
    throw error; // Re-throw pour que NextAuth gère l'erreur proprement
  }
},
```

**Step 2: Update session callback to include role**

Replace the session callback (lines 278-286):

```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id;
    session.user.role = token.role;
    session.user.businessId = token.businessId;
    session.user.subscriptionStatus = token.subscriptionStatus;
    session.user.isPro = token.isPro;
  }
  return session;
},
```

**Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 4: Commit**

```bash
git add lib/auth.ts
git commit -m "feat: add role to JWT and session callbacks"
```

---

## Task 4: Add Super Admin Validation Helper

**Files:**
- Modify: `lib/auth-helpers.ts` (add at end before closing)

**Step 1: Add validateSuperAdmin function**

Add this function at the end of the file (before the final closing):

```typescript

/**
 * Valide que l'utilisateur connecté est un super admin
 *
 * @returns ValidatedSession si succès, AuthError si échec
 */
export async function validateSuperAdmin(): Promise<ValidatedSession | AuthError> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Non authentifié", code: "UNAUTHORIZED" };
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    return { error: "Accès interdit - Super Admin requis", code: "UNAUTHORIZED" };
  }

  // Lazy import Sentry
  const Sentry = await import("@sentry/nextjs");
  Sentry.setContext("super_admin", {
    userId: session.user.id,
    email: session.user.email,
  });

  return {
    userId: session.user.id,
    userEmail: session.user.email,
    businessId: session.user.businessId || '', // Optionnel pour super admin
  };
}
```

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 3: Commit**

```bash
git add lib/auth-helpers.ts
git commit -m "feat: add validateSuperAdmin helper"
```

---

## Task 5: Add Super Admin Action Wrapper

**Files:**
- Modify: `lib/action-wrapper.ts` (add at end before closing)

**Step 1: Import validateSuperAdmin**

Add to imports at top of file (after existing imports):

```typescript
import { validateSuperAdmin } from "@/lib/auth-helpers";
```

**Step 2: Add withSuperAdminAuth wrapper**

Add at the end of the file (before closing):

```typescript

/**
 * Higher-order function that wraps server action handlers with super admin authentication.
 *
 * @param handler - The server action handler function
 * @param actionName - Name of the action for error logging
 * @returns Wrapped function that validates super admin role
 *
 * @example
 * export const getAllBusinesses = withSuperAdminAuth(
 *   async (_input: void, _session) => {
 *     const businesses = await prisma.business.findMany({});
 *     return successResult(businesses);
 *   },
 *   "getAllBusinesses"
 * );
 */
export function withSuperAdminAuth<TInput, TOutput>(
  handler: (
    input: TInput,
    session: ValidatedSession
  ) => Promise<ActionResult<TOutput>>,
  actionName: string
) {
  return async (input: TInput): Promise<ActionResult<TOutput>> => {
    // Validate super admin session
    const validation = await validateSuperAdmin();

    if ('error' in validation) {
      return errorResult(validation.error);
    }

    try {
      // Call the wrapped handler
      return await handler(input, validation);
    } catch (error) {
      // BusinessError: preserve user-facing message
      if (error instanceof BusinessError) {
        return errorResult(error.message, error.code);
      }

      // Technical errors: log to Sentry with super_admin tag
      const Sentry = await import("@sentry/nextjs");
      Sentry.captureException(error, {
        tags: {
          action: actionName,
          type: 'super_admin_action',
        },
        user: { id: validation.userId, email: validation.userEmail }
      });

      // Development logging
      if (process.env.NODE_ENV === "development") {
        console.error(`Error in super admin action ${actionName}:`, error);
      }

      return errorResult(`Erreur lors de ${actionName}`);
    }
  };
}
```

**Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 4: Commit**

```bash
git add lib/action-wrapper.ts
git commit -m "feat: add withSuperAdminAuth action wrapper"
```

---

## Task 6: Create Admin Server Actions

**Files:**
- Create: `app/actions/admin.ts`

**Step 1: Create admin actions file**

Create file with all admin server actions:

```typescript
"use server";

import { withSuperAdminAuth } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionStatus } from "@prisma/client";

/**
 * Get all businesses (super admin only)
 * No businessId filter - super admin sees ALL businesses
 */
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

/**
 * Get detailed info for a specific business (super admin only)
 */
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

/**
 * Update business data (super admin only)
 */
export const updateBusinessAsAdmin = withSuperAdminAuth(
  async (input: {
    businessId: string;
    data: {
      name?: string;
      address?: string;
      rue?: string;
      ville?: string;
      codePostal?: string;
      phone?: string;
      email?: string;
      subscriptionStatus?: SubscriptionStatus;
      isPro?: boolean;
    }
  }, _session) => {
    const business = await prisma.business.update({
      where: { id: input.businessId },
      data: input.data
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/businesses/${input.businessId}`);

    return successResult(business);
  },
  "updateBusinessAsAdmin"
);

/**
 * Toggle business status (suspend/activate)
 */
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

/**
 * Delete business (with cascade)
 */
export const deleteBusinessAsAdmin = withSuperAdminAuth(
  async (input: { businessId: string }, _session) => {
    // Cascade delete configured in schema.prisma
    await prisma.business.delete({
      where: { id: input.businessId }
    });

    revalidatePath('/admin');

    return successResult({ id: input.businessId });
  },
  "deleteBusinessAsAdmin"
);
```

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 3: Commit**

```bash
git add app/actions/admin.ts
git commit -m "feat: add super admin server actions"
```

---

## Task 7: Create Admin Layout with Protection

**Files:**
- Create: `app/(admin)/layout.tsx`

**Step 1: Create admin route group and layout**

Create the file:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Not authenticated → login
  if (!session) {
    redirect("/login");
  }

  // Not super admin → redirect to normal dashboard
  if (session.user.role !== 'SUPER_ADMIN') {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 3: Commit**

```bash
git add app/(admin)/layout.tsx
git commit -m "feat: add admin layout with super admin protection"
```

---

## Task 8: Create Admin Dashboard Page

**Files:**
- Create: `app/(admin)/admin/page.tsx`

**Step 1: Create admin dashboard page**

```typescript
import { getAllBusinesses } from "@/app/actions/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const result = await getAllBusinesses();

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="text-red-600">
          Erreur : {result.error}
        </div>
      </div>
    );
  }

  const businesses = result.data;

  // Calculate stats
  const stats = {
    total: businesses.length,
    active: businesses.filter(b => b.subscriptionStatus === 'ACTIVE').length,
    trial: businesses.filter(b => b.subscriptionStatus === 'TRIAL').length,
    canceled: businesses.filter(b => b.subscriptionStatus === 'CANCELED').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Administration Solkant</h1>
        <p className="text-gray-600">Gestion des businesses et utilisateurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Essais</p>
          <p className="text-3xl font-bold text-orange-600">{stats.trial}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Annulés</p>
          <p className="text-3xl font-bold text-red-600">{stats.canceled}</p>
        </div>
      </div>

      {/* Business List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Businesses</h2>
          <div className="space-y-4">
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/admin/businesses/${business.id}`}
                className="block p-4 border rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{business.name}</h3>
                    <p className="text-sm text-gray-600">{business.user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      business.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      business.subscriptionStatus === 'TRIAL' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {business.subscriptionStatus}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {business._count.clients} clients · {business._count.quotes} devis
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify page loads**

Run: `npm run dev`

Navigate to: `http://localhost:3000/admin` (should redirect to login if not authenticated)

Expected: Page renders (or redirects appropriately)

**Step 3: Commit**

```bash
git add app/(admin)/admin/page.tsx
git commit -m "feat: add admin dashboard page with business list"
```

---

## Task 9: Create Business Details Page

**Files:**
- Create: `app/(admin)/admin/businesses/[id]/page.tsx`

**Step 1: Create business details page**

```typescript
import { getBusinessDetails } from "@/app/actions/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BusinessDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getBusinessDetails({ businessId: id });

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="text-red-600">Erreur : {result.error}</div>
      </div>
    );
  }

  const business = result.data;

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <p className="text-gray-600">{business.user.email}</p>
      </div>

      {/* Info Section */}
      <div className="bg-white p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-bold mb-4">Informations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nom</p>
            <p className="font-medium">{business.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{business.email || 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Téléphone</p>
            <p className="font-medium">{business.phone || 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Adresse</p>
            <p className="font-medium">{business.address || 'Non renseignée'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Statut abonnement</p>
            <p className="font-medium">{business.subscriptionStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pro</p>
            <p className="font-medium">{business.isPro ? 'Oui' : 'Non'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Clients</p>
          <p className="text-2xl font-bold">{business.clients.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Devis</p>
          <p className="text-2xl font-bold">{business.quotes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Services</p>
          <p className="text-2xl font-bold">{business.services.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Forfaits</p>
          <p className="text-2xl font-bold">{business.packages.length}</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 3: Commit**

```bash
git add app/(admin)/admin/businesses
git commit -m "feat: add business details page"
```

---

## Task 10: Add Admin Link to Dashboard Nav

**Files:**
- Modify: `app/(dashboard)/dashboard/_components/DashboardNav.tsx`

**Step 1: Add session prop to component**

Modify the interface and component signature (lines 8-16):

```typescript
import { Session } from "next-auth";

interface DashboardNavProps {
  userName?: string | null;
  userEmail?: string | null;
  session?: Session | null;
}

export default function DashboardNav({
  userName,
  userEmail,
  session,
}: DashboardNavProps) {
```

**Step 2: Add admin link in navigation**

Add after the "Paramètres" link (around line 119, before closing </nav>):

```typescript
              {session?.user?.role === 'SUPER_ADMIN' && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Plateforme
                </Link>
              )}
```

**Step 3: Update dashboard layout to pass session**

Modify: `app/(dashboard)/layout.tsx`

Find where DashboardNav is used and add session prop:

```typescript
<DashboardNav
  userName={session.user?.name}
  userEmail={session.user?.email}
  session={session}
/>
```

**Step 4: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 5: Commit**

```bash
git add app/(dashboard)/dashboard/_components/DashboardNav.tsx app/(dashboard)/layout.tsx
git commit -m "feat: add admin link in dashboard nav for super admins"
```

---

## Task 11: Create Super Admin Promotion Script

**Files:**
- Create: `scripts/make-super-admin.ts`

**Step 1: Create script file**

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

**Step 2: Verify script executes**

Run: `npx tsx scripts/make-super-admin.ts`

Expected: Usage message displayed

**Step 3: Commit**

```bash
git add scripts/make-super-admin.ts
git commit -m "feat: add script to promote users to super admin"
```

---

## Task 12: Test Super Admin Flow

**Files:**
- N/A (manual testing)

**Step 1: Start dev server**

Run: `npm run dev`

Expected: Server starts on http://localhost:3000

**Step 2: Promote a test user to super admin**

Run: `npx tsx scripts/make-super-admin.ts <your-test-email>`

Expected: "✅ <email> promu SUPER_ADMIN avec succès"

**Step 3: Test login and redirect**

1. Navigate to http://localhost:3000/login
2. Login with the promoted user
3. Check that "Admin Plateforme" link appears in nav
4. Click on "Admin Plateforme" link
5. Verify redirect to /admin
6. Verify business list displays

Expected: All navigation works, admin page displays businesses

**Step 4: Test protection**

1. Logout
2. Try to access http://localhost:3000/admin directly
3. Verify redirect to /login

Expected: Unauthenticated users cannot access admin pages

**Step 5: Manual verification complete**

No commit needed - testing step only

---

## Task 13: Final Commit and Cleanup

**Files:**
- Multiple (final checks)

**Step 1: Run linter**

Run: `npm run lint`

Expected: No errors (or only warnings)

**Step 2: Run type check**

Run: `npx tsc --noEmit`

Expected: No type errors

**Step 3: Verify all migrations applied**

Run: `npx prisma migrate status`

Expected: "Database is up to date"

**Step 4: Create final commit if any fixes needed**

```bash
git add .
git commit -m "chore: final cleanup for super admin feature"
```

**Step 5: Push to remote**

```bash
git push origin sonarcube
```

Expected: Changes pushed successfully

---

## Testing Checklist

After implementation, verify:

- [ ] Super admin can access `/admin`
- [ ] Normal users redirected from `/admin` to `/dashboard`
- [ ] Business list displays all businesses
- [ ] Business details page shows complete info
- [ ] Admin link only visible to super admins
- [ ] Script successfully promotes users
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Role persists across login sessions (JWT includes role)

---

## Next Steps (Phase 3 - Future)

- [ ] Implement impersonation feature
- [ ] Add banner for impersonation mode
- [ ] Create business edit form (client component)
- [ ] Add delete confirmation dialog
- [ ] Implement toggle suspend/activate
- [ ] Add search and filters to business list

---

## Notes

- All tasks follow TDD where applicable
- Frequent commits after each major change
- Type safety enforced throughout
- Super admin bypasses businessId filter (security by design)
- Phase 3 (impersonation) deferred to separate implementation
