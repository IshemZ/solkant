# Design : Personnalisation du nom des fichiers PDF de devis

**Date** : 2025-12-15
**Statut** : Validé
**Auteur** : Design validé avec le client

## Contexte

Actuellement, les fichiers PDF générés pour les devis utilisent uniquement le numéro de devis comme nom de fichier (ex: `DEVIS-2024-001.pdf`). Les gérants d'instituts souhaitent pouvoir personnaliser ce nom pour inclure un préfixe générique et le nom du client.

## Objectif

Permettre au gérant de configurer un nom générique qui sera utilisé pour nommer les fichiers PDF selon le format : `{Nom Générique} - {Nom} {Prénom}.pdf`

### Exemple
- Configuration : Nom générique = "Devis Laser Diode"
- Client : Marie Dupont
- Résultat : `Devis Laser Diode - Dupont Marie.pdf`

## Exigences fonctionnelles

1. Le gérant configure un "nom générique" optionnel dans les paramètres de son entreprise
2. Ce nom générique est limité à 25 caractères maximum
3. Logique de nommage :
   - **Si** nom générique configuré **ET** devis a un client → `{nom générique} - {Nom} {Prénom}.pdf`
   - **Sinon** (pas de nom générique OU pas de client) → `{numéro devis}.pdf` (comportement actuel)
4. Rétrocompatibilité totale : les entreprises qui ne configurent pas ce champ continuent avec le comportement actuel

## Solution technique

### 1. Base de données

**Modèle Prisma** - Ajout au modèle `Business` :

```prisma
model Business {
  // ... champs existants ...
  showInstallmentPayment Boolean @default(false)
  pdfFileNamePrefix      String? // Nouveau champ
  // ... relations ...
}
```

**Migration** :

```sql
ALTER TABLE "businesses" ADD COLUMN "pdfFileNamePrefix" TEXT;
```

**Validation Zod** - Dans `lib/validations/business.ts` :

```typescript
pdfFileNamePrefix: z
  .string()
  .max(25, "Le nom générique ne peut pas dépasser 25 caractères")
  .optional()
  .nullable()
```

### 2. Interface utilisateur

**Emplacement** : Section "Options des devis" dans `app/(dashboard)/dashboard/parametres/_components/BusinessSettingsForm.tsx`

**Nouveau champ** :

```tsx
<div>
  <label htmlFor="pdfFileNamePrefix" className="block text-sm font-medium text-foreground">
    Nom générique des fichiers PDF
  </label>
  <input
    type="text"
    id="pdfFileNamePrefix"
    name="pdfFileNamePrefix"
    defaultValue={business.pdfFileNamePrefix || ""}
    maxLength={25}
    placeholder="Ex: Devis Laser Diode"
    className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
  />
  <p className="mt-1 text-sm text-foreground/60">
    Si défini, les PDF seront nommés "{nom générique} - {Nom} {Prénom}.pdf".
    Sinon, le numéro de devis sera utilisé.
  </p>
  {fieldErrors.pdfFileNamePrefix && (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {fieldErrors.pdfFileNamePrefix[0]}
    </p>
  )}
</div>
```

**Caractéristiques** :
- Champ optionnel (pas de `required`)
- Limite HTML `maxLength={25}`
- Placeholder avec exemple concret
- Texte d'aide explicatif
- Gestion des erreurs de validation

### 3. Server Actions

**Modification de `app/actions/business.ts`** :

```typescript
export async function updateBusiness(data: {
  name: string;
  rue: string | null;
  complement: string | null;
  codePostal: string | null;
  ville: string | null;
  phone: string | null;
  email: string | null;
  siret: string | null;
  logo: string | null;
  showInstallmentPayment: boolean;
  pdfFileNamePrefix: string | null; // Nouveau champ
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) {
    return { success: false, error: "Non autorisé" };
  }

  const validation = updateBusinessSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Données invalides",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const business = await prisma.business.update({
    where: { id: session.user.businessId },
    data: validation.data,
  });

  revalidatePath("/dashboard/parametres");
  return { success: true, data: business };
}
```

**Modification du formulaire** - Dans `BusinessSettingsForm.tsx` :

```typescript
const data = {
  name: formData.get("name") as string,
  rue: (formData.get("rue") as string) || null,
  complement: (formData.get("complement") as string) || null,
  codePostal: (formData.get("codePostal") as string) || null,
  ville: (formData.get("ville") as string) || null,
  phone: (formData.get("phone") as string) || null,
  email: (formData.get("email") as string) || null,
  siret: (formData.get("siret") as string) || null,
  logo: null,
  showInstallmentPayment: formData.get("showInstallmentPayment") === "on",
  pdfFileNamePrefix: (formData.get("pdfFileNamePrefix") as string) || null, // Nouveau
};
```

### 4. Logique de génération du nom de fichier

**Nouvelle fonction utilitaire** - À créer dans `app/api/quotes/[id]/pdf/route.ts` :

```typescript
function generatePdfFileName(quote: QuoteWithRelations): string {
  const { pdfFileNamePrefix } = quote.business;
  const client = quote.client;

  // Si pas de préfixe OU pas de client, utiliser le numéro de devis
  if (!pdfFileNamePrefix || !client) {
    return `${quote.quoteNumber}.pdf`;
  }

  // Sinon, utiliser le format personnalisé
  const clientName = `${client.lastName} ${client.firstName}`;
  return `${pdfFileNamePrefix} - ${clientName}.pdf`;
}
```

**Utilisation dans la route** - Ligne 53 de `route.ts` :

```typescript
return new NextResponse(stream as unknown as BodyInit, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${generatePdfFileName(result.data)}"`,
  },
});
```

## Cas d'usage

### Cas 1 : Configuration complète
- **Configuration** : `pdfFileNamePrefix = "Devis Laser Diode"`
- **Client** : Marie Dupont
- **Résultat** : `Devis Laser Diode - Dupont Marie.pdf` ✓

### Cas 2 : Pas de configuration
- **Configuration** : `pdfFileNamePrefix = null`
- **Client** : Marie Dupont
- **Résultat** : `DEVIS-2024-001.pdf` ✓

### Cas 3 : Configuration mais client supprimé
- **Configuration** : `pdfFileNamePrefix = "Devis Laser Diode"`
- **Client** : `null` (supprimé)
- **Résultat** : `DEVIS-2024-001.pdf` ✓

### Cas 4 : Configuration vide
- **Configuration** : `pdfFileNamePrefix = ""` (chaîne vide)
- **Client** : Marie Dupont
- **Résultat** : `DEVIS-2024-001.pdf` ✓

## Considérations techniques

### Limite de 25 caractères
La limite de 25 caractères permet des noms descriptifs tout en évitant :
- Des noms de fichiers trop longs (problèmes sur certains OS)
- Des noms illisibles ou trop complexes

Exemples valides (< 25 caractères) :
- "Devis Laser Diode" (18)
- "Épilation Définitive" (20)
- "Soin Visage Premium" (20)

### Caractères spéciaux
Les caractères spéciaux dans les noms de fichiers (accentués comme "é", espaces) sont supportés par le header `Content-Disposition` moderne. Pas de nettoyage nécessaire.

### Rétrocompatibilité
Le champ `pdfFileNamePrefix` est nullable avec une valeur par défaut `null`. Toutes les entreprises existantes auront automatiquement `null`, préservant le comportement actuel sans migration de données.

## Plan d'implémentation

1. **Migration base de données**
   - Créer migration pour ajouter `pdfFileNamePrefix` au modèle `Business`
   - Appliquer la migration

2. **Validation**
   - Mettre à jour `lib/validations/business.ts` avec le nouveau champ

3. **Interface utilisateur**
   - Modifier `BusinessSettingsForm.tsx` pour ajouter le nouveau champ dans "Options des devis"

4. **Server Actions**
   - Mettre à jour `app/actions/business.ts` pour supporter le nouveau champ

5. **Génération PDF**
   - Créer la fonction `generatePdfFileName()` dans `app/api/quotes/[id]/pdf/route.ts`
   - Remplacer le nom de fichier statique par l'appel à cette fonction

6. **Tests**
   - Tester la configuration du champ dans les paramètres
   - Tester la génération de PDF avec différents scénarios (avec/sans préfixe, avec/sans client)
   - Vérifier la limite de 25 caractères

## Tests à effectuer

- [ ] Configuration du nom générique dans les paramètres (< 25 caractères)
- [ ] Erreur de validation si > 25 caractères
- [ ] PDF généré avec nom personnalisé quand configuré et client présent
- [ ] PDF généré avec numéro de devis si pas de configuration
- [ ] PDF généré avec numéro de devis si client supprimé
- [ ] Caractères accentués fonctionnent correctement dans le nom
- [ ] Mise à jour de la configuration reflétée immédiatement sur les nouveaux PDF
