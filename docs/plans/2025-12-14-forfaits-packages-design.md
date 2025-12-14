# Design : Fonctionnalité Forfaits (Packages)

**Date :** 2025-12-14
**Statut :** Validé
**Auteur :** Design collaboratif avec l'équipe

## Vue d'ensemble

Ajout d'une fonctionnalité permettant aux instituts de créer des **forfaits** regroupant plusieurs services avec quantités variables et réduction optionnelle.

### Objectifs

- Permettre la création de forfaits multi-services (ex: "7 séances d'épilation laser")
- Supporter des forfaits mixtes (plusieurs services différents)
- Appliquer des réductions optionnelles (pourcentage ou montant fixe)
- Intégrer les forfaits dans les devis de manière transparente
- Préserver l'historique des devis même après suppression de forfaits/services

## Exigences fonctionnelles

### 1. Composition des forfaits

- Un forfait peut contenir un ou plusieurs services
- Chaque service peut avoir une quantité différente
- Les services doivent exister préalablement (services à l'unité)
- Exemples :
  - Forfait simple : "7 séances d'épilation laser" = Épilation laser × 7
  - Forfait mixte : "Forfait Détente" = Massage × 1 + Soin visage × 1 + Manucure × 1

### 2. Tarification

- **Prix de base** : Somme automatique de (prix service × quantité) pour tous les services
- **Réduction optionnelle** : Deux types possibles
  - Pourcentage (0-100%)
  - Montant fixe (en euros)
- **Prix final** : Prix de base - réduction

### 3. Utilisation dans les devis

- Les forfaits sont décomposés en lignes individuelles dans le devis
- Chaque service apparaît avec sa quantité
- La réduction du forfait apparaît dans la section "Remises" du devis
- Exemple dans le devis :
  ```
  Services:
  - Épilation laser × 7 = 420,00 €

  Remises:
  - Remise forfait "7 séances laser" = -70,00 €

  Total: 350,00 €
  ```

### 4. Suppression et archivage

- **Soft delete** : Les services et forfaits ne sont jamais vraiment supprimés
- Marqués comme inactifs (`isActive = false`)
- Les anciens devis continuent de fonctionner
- Les nouveaux devis ne peuvent pas utiliser les services/forfaits archivés

## Architecture technique

### 1. Modèles de données (Prisma)

#### Modèle Package

```prisma
model Package {
  id            String        @id @default(cuid())
  name          String
  description   String?
  discountType  DiscountType  @default(NONE)
  discountValue Decimal       @default(0) @db.Decimal(10, 2)
  isActive      Boolean       @default(true)
  deletedAt     DateTime?
  businessId    String
  business      Business      @relation(fields: [businessId], references: [id], onDelete: Cascade)
  items         PackageItem[]
  quoteItems    QuoteItem[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([businessId])
  @@index([isActive])
}

enum DiscountType {
  NONE
  PERCENTAGE
  FIXED
}
```

#### Modèle PackageItem

```prisma
model PackageItem {
  id        String  @id @default(cuid())
  packageId String
  package   Package @relation(fields: [packageId], references: [id], onDelete: Cascade)
  serviceId String
  service   Service @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  quantity  Int     @default(1)

  @@index([packageId])
  @@index([serviceId])
}
```

#### Modification du modèle Service

```prisma
model Service {
  // ... champs existants
  isActive      Boolean       @default(true)
  deletedAt     DateTime?
  packageItems  PackageItem[]

  // ... reste du modèle
}
```

#### Modification du modèle QuoteItem

```prisma
model QuoteItem {
  // ... champs existants
  packageId String?
  package   Package? @relation(fields: [packageId], references: [id])

  // ... reste du modèle
}
```

### 2. Structure des fichiers

```
app/(dashboard)/dashboard/services/
├── page.tsx (modifié - ajout système d'onglets)
├── forfaits/
│   ├── nouveau/
│   │   └── page.tsx
│   └── [id]/
│       └── edit/
│           └── page.tsx
├── _components/
│   ├── ServicesList.tsx (existant)
│   ├── ServiceForm.tsx (existant)
│   ├── ServiceTabs.tsx (nouveau)
│   ├── PackagesList.tsx (nouveau)
│   └── PackageForm.tsx (nouveau)

app/actions/
├── services.ts (modifié - soft delete)
└── packages.ts (nouveau)

lib/validations/
├── service.ts (modifié - isActive)
└── package.ts (nouveau)
```

### 3. Server Actions

#### `app/actions/packages.ts`

```typescript
// Liste uniquement les forfaits actifs
export async function getPackages()

// Récupère un forfait avec tous ses items
export async function getPackageById(id: string)

// Crée un nouveau forfait
export async function createPackage(input: CreatePackageInput)

// Modifie un forfait
export async function updatePackage(id: string, input: UpdatePackageInput)

// Soft delete : marque isActive = false
export async function deletePackage(id: string)
```

#### Modification de `app/actions/services.ts`

```typescript
// getServices() filtre par isActive = true
// deleteService() devient soft delete
```

### 4. Schémas de validation Zod

#### `lib/validations/package.ts`

```typescript
export const createPackageSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0),
  items: z.array(
    z.object({
      serviceId: z.string().cuid(),
      quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
    })
  ).min(1, "Vous devez ajouter au moins un service"),
}).refine((data) => {
  // Si réduction en pourcentage, vérifier 0-100
  if (data.discountType === "PERCENTAGE") {
    return data.discountValue >= 0 && data.discountValue <= 100;
  }
  return true;
}, {
  message: "Le pourcentage doit être entre 0 et 100",
  path: ["discountValue"],
});
```

## Interface utilisateur

### 1. Organisation dans la page Services

**URL :** `/dashboard/services`

La page utilise un système d'onglets :

**Onglet "Services à l'unité"** (par défaut)
- Liste actuelle des services
- Bouton "Nouveau service"
- Comportement identique à l'existant

**Onglet "Forfaits"** (`?tab=packages`)
- Liste des forfaits actifs
- Bouton "Nouveau forfait"
- Tableau avec colonnes :
  - Nom
  - Services inclus (résumé)
  - Prix de base
  - Réduction
  - Prix final
  - Actions (Modifier, Supprimer)

### 2. Formulaire de création de forfait

**URL :** `/dashboard/services/forfaits/nouveau`

**Formulaire en une seule page avec sections :**

#### Section 1 : Informations générales
- Champ "Nom du forfait" (requis)
- Champ "Description" (optionnel, textarea)

#### Section 2 : Services inclus
- Liste dynamique avec bouton "+ Ajouter un service"
- Chaque ligne :
  - Dropdown : Sélection du service
  - Input : Quantité (min: 1)
  - Affichage : Prix unitaire (lecture seule)
  - Affichage : Sous-total (prix × quantité)
  - Bouton : Supprimer la ligne
- **Prix de base total** affiché (somme de tous les sous-totaux)

#### Section 3 : Réduction optionnelle
- Toggle "Appliquer une réduction sur ce forfait ?"
- Si activé :
  - Radio buttons : "Pourcentage" ou "Montant fixe"
  - Input nombre selon le choix
- **Prix final** affiché (avec réduction appliquée)

#### Section 4 : Actions
- Bouton "Enregistrer le forfait" (primary)
- Bouton "Annuler" (retour aux forfaits)

### 3. Intégration dans les devis

**Modification de `QuoteForm.tsx` :**

**Sélection de services/forfaits :**
- Dropdown avec deux sections :
  - "Services à l'unité"
  - "Forfaits"

**Comportement lors de l'ajout d'un forfait :**
1. L'utilisateur sélectionne un forfait
2. Le système ajoute automatiquement :
   - Une ligne par service avec sa quantité
   - Chaque ligne garde la référence `packageId`
3. Si le forfait a une réduction :
   - Ajout automatique d'une ligne de remise
   - Nom : "Remise forfait '[Nom du forfait]'"
   - Montant selon le type (pourcentage ou fixe)

**Affichage dans le PDF du devis :**
- Section Services : toutes les lignes détaillées
- Section Remises : la réduction du forfait
- Total calculé avec la réduction appliquée

## Gestion des erreurs

### Validations du formulaire

1. **Nom du forfait vide** : "Le nom du forfait est requis"
2. **Aucun service ajouté** : "Vous devez ajouter au moins un service"
3. **Quantité invalide** : "La quantité doit être au moins 1"
4. **Réduction en pourcentage > 100%** : "Le pourcentage ne peut pas dépasser 100%"
5. **Réduction fixe > prix de base** : "La réduction ne peut pas dépasser le prix de base"

### Suppressions

- **Suppression d'un service utilisé dans des forfaits** :
  - Soft delete appliqué
  - Message : "Service archivé avec succès. Il ne sera plus disponible pour de nouveaux forfaits."

- **Suppression d'un forfait utilisé dans des devis** :
  - Soft delete appliqué
  - Message : "Forfait archivé avec succès. Il ne sera plus disponible pour de nouveaux devis."

### Affichage des services/forfaits archivés

- Les dropdowns n'affichent que les éléments actifs (`isActive = true`)
- Dans les devis existants, les services archivés s'affichent normalement
- Badge optionnel "Archivé" si nécessaire

## Flux de données

### Création d'un forfait

```
1. Utilisateur remplit le formulaire
2. Validation côté client (Zod)
3. Appel à createPackage(input)
4. Server Action :
   - Vérifie session + businessId
   - Valide les données
   - Vérifie que tous les services existent et appartiennent au business
   - Crée le Package en transaction
   - Crée tous les PackageItems
5. Revalidation du path /dashboard/services
6. Redirection vers l'onglet forfaits
```

### Ajout d'un forfait au devis

```
1. Utilisateur sélectionne un forfait dans le dropdown
2. Frontend :
   - Récupère les détails du forfait (items + réduction)
   - Crée une ligne QuoteItem par service du forfait
   - Ajoute packageId à chaque ligne
   - Calcule le prix de base
   - Si réduction : ajoute une ligne de remise
3. Affichage en temps réel du total mis à jour
4. Lors de la sauvegarde : createQuote() enregistre toutes les lignes
```

## Migration de la base de données

### Étapes de migration

1. **Ajouter les nouveaux modèles** : Package, PackageItem, DiscountType
2. **Modifier Service** : Ajouter isActive, deletedAt, packageItems
3. **Modifier QuoteItem** : Ajouter packageId (nullable)
4. **Générer la migration** : `npx prisma migrate dev --name add-packages`
5. **Appliquer en production** : `npx prisma migrate deploy`

### Script de données initiales (optionnel)

Aucune donnée initiale requise. Les forfaits seront créés par les utilisateurs.

## Tests requis

### Tests unitaires

- Validation Zod des schémas de forfaits
- Calcul du prix de base (somme des services × quantités)
- Calcul du prix final avec réduction (pourcentage et fixe)
- Soft delete des services et forfaits

### Tests d'intégration

- Création d'un forfait complet
- Ajout d'un forfait à un devis
- Suppression d'un service utilisé dans un forfait
- Affichage correct dans le PDF du devis

### Tests E2E

- Parcours complet : créer un forfait → l'ajouter à un devis → générer le PDF
- Archivage d'un forfait et vérification qu'il n'apparaît plus dans les dropdowns

## Considérations de sécurité

### Multi-tenant

- **businessId** obligatoire sur Package
- Tous les Server Actions filtrent par `session.user.businessId`
- Vérifier que les services d'un forfait appartiennent au même business

### Validation

- Validation Zod côté serveur obligatoire
- Vérification de l'existence des services avant création du forfait
- Empêcher les réductions négatives ou > 100% pour les pourcentages

## Points d'attention

1. **Performance** : Utiliser des transactions Prisma pour créer Package + PackageItems atomiquement
2. **UX** : Calculer et afficher le prix total en temps réel pendant la saisie du formulaire
3. **Cohérence** : S'assurer que les remises de forfaits s'affichent bien dans la section "Remises" du PDF
4. **Rétrocompatibilité** : Le soft delete préserve tous les devis existants

## Évolutions futures possibles

- Statistiques sur les forfaits les plus vendus
- Duplication de forfaits
- Catégorisation des forfaits
- Forfaits avec durée de validité
- Gestion des forfaits "épuisés" (tracking des séances utilisées)

---

**Validation :** ✅ Design validé le 2025-12-14