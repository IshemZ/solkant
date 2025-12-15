# Address Field Separation Design

**Date:** 2025-12-15
**Status:** Approved
**Target Models:** Business, Client

## Overview

Replace the single `address` field with structured address fields (rue, complément, code postal, ville) for both Business and Client models. The old address field will be kept temporarily for legacy data during a transition period.

## Design Decisions

### Scope
- **Models affected:** Business and Client
- **Address structure:** Extended French format with 4 fields

### Field Structure
- `rue` (String) - Street address - **Required**
- `complement` (String) - Optional address line 2 - Optional
- `codePostal` (String) - 5-digit postal code - **Required**
- `ville` (String) - City name - **Required**

### Migration Strategy
- **Approach:** Keep old `address` field temporarily
- **Forms:** Show only new fields, display legacy address as read-only reference if populated
- **Cleanup:** Remove old field in future migration after transition period

### Implementation Approach
- **Pattern:** Flat fields directly on models (Approach 1)
- **Rationale:** Simple queries, type safety, no joins, easy validation, PostgreSQL indexing support

## Database Schema Changes

### Prisma Schema

Both `Business` and `Client` models receive four new fields:

```prisma
model Business {
  // ... existing fields
  address        String?  // OLD - keep temporarily for legacy data
  rue            String?  // NEW - street address
  complement     String?  // NEW - optional address line 2
  codePostal     String?  // NEW - postal code
  ville          String?  // NEW - city
  // ... rest of fields
}

model Client {
  // ... existing fields
  address        String?  // OLD - keep temporarily for legacy data
  rue            String?  // NEW - street address
  complement     String?  // NEW - optional address line 2
  codePostal     String?  // NEW - postal code
  ville          String?  // NEW - city
  // ... rest of fields
}
```

### Migration

The migration will:
1. Add four new nullable columns to `businesses` table
2. Add four new nullable columns to `clients` table
3. Keep existing `address` column intact (no data loss)
4. Include SQL comment noting new fields replace old address

### Indexing

No indexes on new fields initially. Can add later if filtering by city/postal code becomes necessary.

## Validation Updates

### Files to Update
- `lib/validations/business.ts`
- `lib/validations/client.ts`

### Validation Rules

```typescript
// In both updateBusinessSchema and createClientSchema/updateClientSchema
{
  // OLD - backward compatibility only
  address: z.string().optional(),

  // NEW - structured address fields
  rue: z.string().min(1, "La rue est requise").max(255).optional(),
  complement: z.string().max(255).optional(),
  codePostal: z.string()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres")
    .optional(),
  ville: z.string().min(1, "La ville est requise").max(100).optional(),
}
```

**Validation behavior:**
- Rue, codePostal, ville: Optional at schema level but marked required in form HTML
- Complement: Truly optional everywhere
- CodePostal: French format validation (exactly 5 digits)
- Old address field: Present for backward compatibility but not used in forms

## Form Component Updates

### Files to Update
1. `app/(dashboard)/dashboard/clients/_components/ClientForm.tsx`
2. `app/(dashboard)/dashboard/parametres/_components/BusinessSettingsForm.tsx`

### UI Pattern

```typescript
{/* Legacy address display - only if old address exists and new fields empty */}
{client?.address && !client?.rue && (
  <div className="rounded-md bg-muted p-3 text-sm">
    <p className="font-medium">Ancienne adresse :</p>
    <p className="text-muted-foreground">{client.address}</p>
  </div>
)}

{/* New structured address fields */}
<div className="space-y-4">
  <Label>Rue *</Label>
  <Input name="rue" defaultValue={client?.rue} required />

  <Label>Complément d'adresse</Label>
  <Input name="complement" defaultValue={client?.complement} />

  <Label>Code postal *</Label>
  <Input
    name="codePostal"
    defaultValue={client?.codePostal}
    pattern="\d{5}"
    maxLength={5}
    required
  />

  <Label>Ville *</Label>
  <Input name="ville" defaultValue={client?.ville} required />
</div>
```

### Form Behavior
- HTML5 validation provides immediate feedback (required, pattern)
- Zod validation on submit provides French error messages
- Legacy address box only shown when old address exists AND new fields are empty
- Once new fields saved, legacy box disappears
- Server Actions pattern unchanged

## Display & Formatting

### Display Helper Function

Add to `lib/utils.ts`:

```typescript
export function formatAddress(entity: {
  rue?: string | null;
  complement?: string | null;
  codePostal?: string | null;
  ville?: string | null;
  address?: string | null; // legacy fallback
}): string {
  // Use new structured fields if available
  if (entity.rue || entity.codePostal || entity.ville) {
    const parts = [
      entity.rue,
      entity.complement,
      entity.codePostal && entity.ville ? `${entity.codePostal} ${entity.ville}` : null
    ].filter(Boolean);
    return parts.join('\n');
  }

  // Fallback to legacy address
  return entity.address || '';
}
```

### Files Using Addresses

Update these locations to use `formatAddress()`:

1. **PDF Quotes** - `components/pdf/QuotePDF.tsx` (business and client addresses)
2. **Quote View** - `app/(dashboard)/dashboard/devis/_components/QuoteView.tsx`
3. **Client List** - `app/(dashboard)/dashboard/clients/_components/ClientsList.tsx`
4. **Email Templates** - `lib/emails/quote-email.ts`

### Display Behavior
- Prioritize new structured fields if any are filled
- Fallback to legacy `address` if all new fields empty
- Gracefully handle partial data
- Multi-line format for addresses

## Server Actions

### Files Affected
1. `app/actions/clients.ts` - createClient, updateClient
2. `app/actions/business.ts` - updateBusiness

### Changes Required

**No logic changes needed!** The actions automatically handle new fields because:

- Zod schemas validate new fields
- Prisma ORM includes them in create/update operations
- TypeScript types auto-generated from schema
- Multi-tenant `businessId` filtering unchanged

Example (unchanged pattern):

```typescript
export async function updateClient(id: string, input: UpdateClientInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) return { error: "Non autorisé" };

  const validation = updateClientSchema.safeParse(input);
  if (!validation.success) return { error: formatZodErrors(validation.error) };

  const client = await prisma.client.update({
    where: { id, businessId: session.user.businessId },
    data: validation.data, // includes rue, complement, codePostal, ville
  });

  revalidatePath("/dashboard/clients");
  return { data: client };
}
```

## Testing Strategy

### Unit Tests

**Files to update:**
- `tests/actions/clients.test.ts`
- `tests/actions/business.test.ts`
- `tests/validations/client.test.ts`
- `tests/validations/business.test.ts`

**Test cases to add:**
- Create/update with structured address fields
- Postal code validation (5 digits required)
- Required field validation (rue, codePostal, ville)
- Optional complement field
- Legacy address fallback doesn't break existing tests

**Example test:**

```typescript
it('should create client with structured address', async () => {
  const result = await createClient({
    firstName: 'Marie',
    lastName: 'Dupont',
    rue: '123 Rue de Rivoli',
    complement: 'Appartement 4B',
    codePostal: '75001',
    ville: 'Paris',
  });

  expect(result.data).toMatchObject({
    rue: '123 Rue de Rivoli',
    complement: 'Appartement 4B',
    codePostal: '75001',
    ville: 'Paris',
  });
});
```

### E2E Tests

**Files to update:**
- `e2e/quote-flow.spec.ts`
- `e2e/helpers.ts`

**Updates needed:**
- Update client/business creation helpers to use new address fields
- Verify PDF generation includes formatted addresses
- Test form validation for postal code format

## Migration Rollout

### Phase 1: Deploy (Immediate)
1. Run migration to add new columns
2. Deploy updated forms with new fields
3. Deploy formatAddress() helper for display
4. Old addresses remain visible in legacy boxes

### Phase 2: Transition (Weeks/Months)
- Users gradually update records with new structured addresses
- Both old and new fields coexist
- Monitor adoption

### Phase 3: Cleanup (Future)
When comfortable that most data migrated:
1. Create migration to drop `address` column from both tables
2. Remove from Prisma schema
3. Remove from Zod validation schemas
4. Remove legacy display logic from forms
5. Remove fallback logic from `formatAddress()`

## Non-Goals (Out of Scope)

- Automatic parsing/migration of existing addresses
- Country field (French addresses only)
- Multiple addresses per entity
- Address validation against external APIs
- Geocoding/maps integration

## Success Criteria

- ✅ New Business/Client records can use structured addresses
- ✅ Existing addresses remain visible and accessible
- ✅ PDFs render addresses correctly with both old and new format
- ✅ Forms validate postal codes (5 digits)
- ✅ All tests pass with 80%+ coverage
- ✅ No data loss during migration
- ✅ Multi-tenant isolation maintained
