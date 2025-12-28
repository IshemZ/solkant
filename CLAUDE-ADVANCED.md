# CLAUDE-ADVANCED.md

Advanced technical reference for Claude Code. For critical rules, see [CLAUDE.md](CLAUDE.md).

---

## Table of Contents

1. [Full Commands Reference](#full-commands-reference)
2. [TypeScript Patterns](#typescript-patterns)
3. [Adding New Resource](#adding-new-resource)
4. [PDF Generation](#pdf-generation)
5. [External Integrations](#external-integrations)
6. [Testing](#testing)
7. [Quote Number Generation](#quote-number-generation)

---

## Full Commands Reference

### Development

```bash
npm run dev                    # Start dev server on :3000
npm run build                  # Production build (cleans cache, generates Prisma client) - NO migrations
npm run build:with-migrate     # Build WITH migrations (use with caution)
npm start                      # Start production server
npm run lint                   # Run ESLint
```

### Database

```bash
# Development
npx prisma migrate dev         # Create and apply migration (uses DIRECT_URL)
npx prisma generate            # Regenerate Prisma client after schema changes
npx prisma studio              # Launch GUI database explorer

# Production
# Migrations are applied AUTOMATICALLY during Vercel deployments via build command:
# "npx prisma migrate deploy" runs before "next build"

# Manual migration (if needed)
npm run migrate:prod           # Apply migrations with confirmation (MANUAL)
npm run migrate:validate       # Validate migration schema without applying

# Utilities
npx tsx scripts/fix-missing-business.ts  # Repair users without Business records
```

**⚠️ IMPORTANT**:
- Migrations are applied automatically on Vercel during build
- Never use `prisma migrate reset` or `db push` in production
- See [Secure Migration Workflow](docs/secure-migrations-workflow.md) for details

### Testing

```bash
# Unit tests (Vitest)
npm test                       # Run tests in watch mode
npm run test:run               # Run tests once
npm run test:ui                # Run with Vitest UI
npm run test:coverage          # Generate coverage report (80% threshold)
npm run test:hydration         # Run specific hydration tests

# E2E tests (Playwright)
npm run test:e2e               # Run E2E tests
npm run test:e2e:ui            # Run with Playwright UI
npm run test:e2e:headed        # Run in headed mode (visible browser)
npm run test:e2e:debug         # Run in debug mode

# All tests
npm run test:all               # Run both unit and E2E tests
```

### Utilities

```bash
npm run clean:cache            # Remove .next cache
npm run clean:all              # Remove all caches (including node_modules/.cache)
npm run env:check              # Validate environment variables
npm run env:template           # Generate .env template
```

---

## TypeScript Patterns

### Prisma Types

```typescript
// Import types from Prisma client
import type { Quote, Client, Service } from '@prisma/client';

// Define relations interface
interface QuoteWithRelations extends Quote {
  client: Client;
  items: QuoteItem[];
}

// Use in component/action
async function getQuoteWithDetails(id: string): Promise<QuoteWithRelations> {
  return await prisma.quote.findUniqueOrThrow({
    where: { id },
    include: {
      client: true,
      items: {
        include: { service: true }
      }
    }
  });
}
```

### NextAuth Types

Extended types in `types/next-auth.d.ts`:

```typescript
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      businessId: string;  // Custom property
    };
  }

  interface User {
    businessId: string;  // Custom property
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    businessId: string;  // Custom property
  }
}
```

### Path Aliases

Use `@/` for root imports (configured in `tsconfig.json`):

```typescript
// ✅ CORRECT
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import type { CreateClientInput } from '@/lib/validations';

// ❌ WRONG - Don't use relative paths for root imports
import { authOptions } from '../../../lib/auth';
```

---

## Adding New Resource

Complete guide for adding a new resource (e.g., Products, Invoices, Appointments).

### 1. Database Schema

Update `prisma/schema.prisma`:

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)

  // Multi-tenant relation (REQUIRED)
  businessId  String
  business    Business @relation(fields: [businessId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([businessId])
}

// Add relation to Business model
model Business {
  // ... existing fields
  products Product[]
}
```

Create and apply migration:

```bash
npx prisma migrate dev --name add_product
```

### 2. Validation Schema

Create `lib/validations/product.ts`:

```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  description: z.string().optional(),
  price: z.number().min(0, 'Le prix doit être positif')
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
```

Export from `lib/validations/index.ts`:

```typescript
export * from './product';
```

### 3. Server Actions

Create `app/actions/products.ts`:

```typescript
'use server';

import { withAuth, withAuthAndValidation } from '@/lib/action-wrapper';
import { prisma } from '@/lib/prisma';
import { createProductSchema, updateProductSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import type { CreateProductInput, UpdateProductInput } from '@/lib/validations';

// List products
export const getProducts = withAuth(
  async (_input: void, session) => {
    const products = await prisma.product.findMany({
      where: { businessId: session.businessId },
      orderBy: { createdAt: 'desc' }
    });
    return { data: products };
  },
  'getProducts'
);

// Get single product
export const getProduct = withAuth(
  async (input: { id: string }, session) => {
    const product = await prisma.product.findFirst({
      where: {
        id: input.id,
        businessId: session.businessId  // Security filter
      }
    });

    if (!product) {
      return { error: 'Produit non trouvé' };
    }

    return { data: product };
  },
  'getProduct'
);

// Create product
export const createProduct = withAuthAndValidation(
  async (input: CreateProductInput, session) => {
    const product = await prisma.product.create({
      data: {
        ...input,
        businessId: session.businessId
      }
    });

    revalidatePath('/dashboard/products');
    return { data: product };
  },
  'createProduct',
  createProductSchema
);

// Update product
export const updateProduct = withAuthAndValidation(
  async (input: UpdateProductInput & { id: string }, session) => {
    const { id, ...data } = input;

    const product = await prisma.product.updateMany({
      where: {
        id,
        businessId: session.businessId  // Security filter
      },
      data
    });

    if (product.count === 0) {
      return { error: 'Produit non trouvé' };
    }

    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${id}`);
    return { data: product };
  },
  'updateProduct',
  updateProductSchema.extend({ id: z.string() })
);

// Delete product
export const deleteProduct = withAuth(
  async (input: { id: string }, session) => {
    const product = await prisma.product.deleteMany({
      where: {
        id: input.id,
        businessId: session.businessId  // Security filter
      }
    });

    if (product.count === 0) {
      return { error: 'Produit non trouvé' };
    }

    revalidatePath('/dashboard/products');
    return { data: { id: input.id } };
  },
  'deleteProduct'
);
```

### 4. Route Structure

Create directory structure in `app/(dashboard)/dashboard/products/`:

```
products/
├── page.tsx              # List view (Server Component)
├── loading.tsx           # Suspense fallback
├── error.tsx             # Error boundary
├── _components/          # Feature-specific components
│   ├── ProductList.tsx
│   ├── ProductForm.tsx
│   ├── ProductCard.tsx
│   └── ProductFilters.tsx
├── nouveau/
│   └── page.tsx          # Create page
└── [id]/
    ├── page.tsx          # Detail/edit page
    └── loading.tsx
```

**Example `products/page.tsx` (List View):**

```typescript
import { Suspense } from 'react';
import { getProducts } from '@/app/actions/products';
import { ProductList } from './_components/ProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ProductsPage() {
  const { data: products, error } = await getProducts();

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Link href="/dashboard/products/nouveau">
          <Button>Nouveau produit</Button>
        </Link>
      </div>

      <ProductList products={products} />
    </div>
  );
}
```

**Example `products/nouveau/page.tsx` (Create):**

```typescript
import { ProductForm } from '../_components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nouveau produit</h1>
      <ProductForm />
    </div>
  );
}
```

### 5. Components

Create in `_components/` directory. Example form component:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Product } from '@prisma/client';

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const input = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
    };

    const result = product
      ? await updateProduct({ ...input, id: product.id })
      : await createProduct(input);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/dashboard/products');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          defaultValue={product?.description || ''}
        />
      </div>

      <div>
        <Label htmlFor="price">Prix (€)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price.toString()}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : product ? 'Modifier' : 'Créer'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
```

---

## PDF Generation

### Library

Using `@react-pdf/renderer` for declarative PDF components.

### Pattern

1. Create React-PDF component in `components/pdf/`
2. Render via API route using `renderToStream()`

### Example PDF Component

`components/pdf/QuotePDF.tsx`:

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Quote, Client, QuoteItem, Service } from '@prisma/client';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 10
  },
  table: {
    marginTop: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold'
  }
});

interface QuotePDFProps {
  quote: Quote & {
    client: Client;
    items: (QuoteItem & { service: Service })[];
  };
}

export function QuotePDF({ quote }: QuotePDFProps) {
  const total = quote.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Devis {quote.number}</Text>

        <View style={styles.section}>
          <Text>Date : {new Date(quote.date).toLocaleDateString('fr-FR')}</Text>
          <Text>Client : {quote.client.name}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={{ flex: 2 }}>Service</Text>
            <Text style={{ flex: 1 }}>Quantité</Text>
            <Text style={{ flex: 1 }}>Prix unitaire</Text>
            <Text style={{ flex: 1 }}>Total</Text>
          </View>

          {quote.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={{ flex: 2 }}>{item.service.name}</Text>
              <Text style={{ flex: 1 }}>{item.quantity}</Text>
              <Text style={{ flex: 1 }}>{item.unitPrice.toFixed(2)} €</Text>
              <Text style={{ flex: 1 }}>
                {(item.quantity * item.unitPrice).toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Total : {total.toFixed(2)} €
          </Text>
        </View>
      </Page>
    </Document>
  );
}
```

### API Route

`app/api/quotes/[id]/pdf/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { QuotePDF } from '@/components/pdf/QuotePDF';
import { renderToStream } from '@react-pdf/renderer';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Fetch quote with relations
  const quote = await prisma.quote.findFirst({
    where: {
      id,
      businessId: session.user.businessId  // Security filter
    },
    include: {
      client: true,
      items: {
        include: { service: true }
      }
    }
  });

  if (!quote) {
    return new NextResponse('Quote not found', { status: 404 });
  }

  // Generate PDF stream
  const stream = await renderToStream(<QuotePDF quote={quote} />);

  // Return stream response
  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="devis-${quote.number}.pdf"`
    }
  });
}
```

### French Locale Formatting

- **Date**: `toLocaleDateString('fr-FR')` → "28/12/2025"
- **Currency**: `{price.toFixed(2)} €` (space before €)
- **Number**: `toLocaleString('fr-FR')` → "1 234,56"

---

## External Integrations

### Neon PostgreSQL

- **Type**: Serverless Postgres with connection pooling
- **Configuration**: Two connection strings required
  - `DATABASE_URL`: Pooled connection for queries (Prisma Client)
  - `DIRECT_URL`: Direct connection for migrations (Prisma Migrate)

### NextAuth v4

- **Version**: Pre-v5 (callbacks API differs from v5)
- **Session**: JWT-based (not database sessions)
- **Callbacks**: `jwt()` and `session()` in `lib/auth.ts`

### Tailwind CSS v4

- **Configuration**: Different format in `postcss.config.mjs`
- **Design System**: Using shadcn/ui components in `components/ui/`

### Sentry

- **Purpose**: Error monitoring
- **Features**: Automatic Vercel Cron Monitors
- **Configuration**: `SENTRY_DSN` env var

### Stripe

- **Status**: Currently disabled in production via `ENABLE_PAYMENTS=false`
- **Configuration**: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`

### Resend

- **Purpose**: Transactional email service
- **Configuration**: `RESEND_API_KEY`

### Upstash Redis

- **Purpose**: Rate limiting
- **Configuration**: `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`

---

## Testing

### Vitest (Unit Tests)

- **Setup**: `vitest.config.ts`
- **Environment**: happy-dom
- **Location**: `/tests` directory
- **Coverage**: 80% threshold for lines, functions, branches, statements

**Run tests:**

```bash
npm test                # Watch mode
npm run test:run        # Run once
npm run test:coverage   # With coverage
```

### Playwright (E2E Tests)

- **Setup**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit
- **Location**: `/tests/e2e` directory

**Run tests:**

```bash
npm run test:e2e        # Headless
npm run test:e2e:ui     # With UI
npm run test:e2e:debug  # Debug mode
```

---

## Quote Number Generation

Auto-generated format: `DEVIS-{YEAR}-{SEQUENCE}`

**Example**: `DEVIS-2024-001`, `DEVIS-2024-002`, `DEVIS-2025-001`

### Implementation

The `generateQuoteNumber()` function in `app/actions/quotes.ts`:

```typescript
async function generateQuoteNumber(businessId: string): Promise<string> {
  const year = new Date().getFullYear();

  // Find last quote for current year
  const lastQuote = await prisma.quote.findFirst({
    where: {
      businessId,
      number: {
        startsWith: `DEVIS-${year}-`
      }
    },
    orderBy: {
      number: 'desc'
    }
  });

  let sequence = 1;

  if (lastQuote) {
    const lastSequence = parseInt(lastQuote.number.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `DEVIS-${year}-${sequence.toString().padStart(3, '0')}`;
}
```

**Key Points:**
- Sequence resets each year
- Zero-padded to 3 digits (001, 002, etc.)
- Scoped per business (multi-tenant safe)
