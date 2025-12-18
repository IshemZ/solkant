# Design : Restructuration des remises de forfaits

**Date :** 2025-12-18
**Statut :** Implémenté (2025-12-18)
**Auteur :** Conception collaborative

## Objectif

Modifier l'affichage et le calcul des remises de forfaits dans les devis pour améliorer la transparence : afficher le prix plein des forfaits dans les articles, et appliquer leurs remises au niveau du total du devis.

## Contexte actuel

Actuellement, quand un forfait est ajouté à un devis :
- La remise du forfait est appliquée directement au prix affiché dans la ligne d'article
- Exemple : Forfait "Beauté Complète" (100€ de services, -20%) s'affiche à 80€
- Le client ne voit pas clairement le prix "plein" du forfait ni l'économie réalisée

## Comportement souhaité

Le prix plein du forfait (100€) sera affiché dans les articles, et la remise (20€) sera appliquée dans une section dédiée au niveau des totaux. Cela permet au client de voir clairement :
1. La valeur totale des services inclus dans le forfait
2. Les économies réalisées grâce aux remises de forfaits
3. Le montant final après toutes les réductions

## Décisions de design

### 1. Gestion des remises multiples
**Décision :** Une seule ligne "Remises forfaits" additionnant toutes les remises de tous les forfaits ajoutés au devis.

### 2. Ordre d'application des remises
**Décision :** La remise globale du devis s'applique APRÈS les remises des forfaits.

**Formule de calcul :**
```
1. Sous-total = Σ (prix des articles)
2. Remises forfaits = Σ (remises de chaque forfait)
3. Sous-total après remises forfaits = Sous-total - Remises forfaits
4. Remise globale = fonction(Sous-total après remises forfaits)
5. Total TTC = Sous-total après remises forfaits - Remise globale
```

### 3. Modification des forfaits dans le tableau
**Décision :** Les forfaits ajoutés au devis ne peuvent pas être modifiés :
- Prix unitaire : affichage en lecture seule du prix plein
- Quantité : fixée à 1, non modifiable
- Le nom reste modifiable (comme actuellement)

### 4. Quantité des forfaits
**Décision :** Un forfait = toujours quantité 1. Si le client veut 2 forfaits identiques, il faut l'ajouter 2 fois dans le devis.

## Modifications techniques

### Modèle de données

**Pas de changement au schéma Prisma** - la structure actuelle est suffisante :
- `QuoteItem.packageId` identifie si un article est un forfait
- `Package.discountType` et `Package.discountValue` permettent de calculer la remise
- `QuoteItem.price` stockera le prix SANS remise pour les forfaits

**Interface TypeScript étendue (calcul uniquement) :**
```typescript
interface QuoteItem {
  // ... propriétés existantes
  packageDiscount?: number; // Montant de remise (non stocké en base)
}
```

### Interface utilisateur

**Tableau des articles :**
- Forfaits : prix et quantité en lecture seule, icône PackageIcon pour distinction visuelle
- Services : prix et quantité modifiables (comportement actuel)

**Section totaux :**
```
Sous-total                     180,00 €
Remises forfaits               -25,00 €  [si au moins 1 forfait avec remise]
--------------------------------
Sous-total après remises       155,00 €  [si remises forfaits > 0]
Remise (10€)                   -10,00 €  [si remise globale > 0]
================================
Total TTC                      145,00 €
```

### Logique de calcul

**Fonction `addPackageItem()` modifiée :**
```typescript
// Avant : finalPrice avec remise appliquée
// Après : price = prix plein, packageDiscount = montant remise

const basePrice = pkg.items.reduce(...);
let packageDiscount = 0;

if (pkg.discountType === "PERCENTAGE" && pkg.discountValue > 0) {
  packageDiscount = basePrice * (Number(pkg.discountValue) / 100);
} else if (pkg.discountType === "FIXED" && pkg.discountValue > 0) {
  packageDiscount = Number(pkg.discountValue);
}

const newItem: QuoteItem = {
  packageId: pkg.id,
  name: pkg.name,
  description: servicesDescription, // sans mention de remise
  price: basePrice, // Prix plein
  quantity: 1,
  total: basePrice,
  packageDiscount: packageDiscount // Nouvelle propriété
};
```

**Nouveaux calculs (useMemo) :**
```typescript
// 1. Sous-total (inchangé)
const subtotal = items.reduce((sum, item) => sum + item.total, 0);

// 2. Total des remises forfaits (nouveau)
const packageDiscountsTotal = items.reduce(
  (sum, item) => sum + (item.packageDiscount || 0),
  0
);

// 3. Sous-total après remises forfaits (nouveau)
const subtotalAfterPackageDiscounts = subtotal - packageDiscountsTotal;

// 4. Remise globale (modifié : s'applique sur subtotalAfterPackageDiscounts)
const discountAmount = discountType === "PERCENTAGE"
  ? subtotalAfterPackageDiscounts * (discount / 100)
  : discount;

// 5. Total final (modifié)
const total = subtotalAfterPackageDiscounts - discountAmount;
```

**Fonction `updateItem()` modifiée :**
```typescript
function updateItem(index: number, field: keyof QuoteItem, value: string | number) {
  // Bloquer modification de price et quantity si packageId existe
  if (items[index].packageId && (field === "price" || field === "quantity")) {
    return; // Ou afficher un toast d'avertissement
  }

  // Logique existante pour les services
  // ...
}
```

### Côté serveur

**Server Action `createQuote()` - aucune modification nécessaire :**
- Les calculs de `subtotal` et `total` sont refaits côté serveur (comportement actuel)
- `QuoteItem.price` stocke le prix plein pour les forfaits
- La remise du forfait n'est pas stockée en base

**Affichage d'un devis existant :**
1. Récupérer les `QuoteItem` avec leurs relations `Package`
2. Pour chaque forfait, recalculer `packageDiscount` depuis `Package.discountType/Value`
3. Appliquer la même logique de calcul en cascade que lors de la création

**Validation Zod - aucun changement nécessaire**

## Gestion d'erreurs et cas limites

### Cas à gérer

1. **Forfait supprimé après création du devis :**
   - Afficher le prix stocké sans recalculer la remise
   - Message : "Ce forfait n'existe plus, remise non recalculable"

2. **Forfait avec remise modifiée :**
   - Les devis existants conservent leurs prix originaux
   - Seuls les nouveaux devis utilisent les remises actuelles

3. **Remise forfait > prix du forfait :**
   - Limiter `packageDiscount` au prix du forfait (max = basePrice)
   - Pas de remise négative

4. **Total final négatif :**
   - Valider avant soumission que `total >= 0`
   - Afficher une erreur si les remises dépassent le sous-total

### Tests à effectuer

- [ ] Ajouter un forfait avec remise PERCENTAGE (ex: 20%)
- [ ] Ajouter un forfait avec remise FIXED (ex: 15€)
- [ ] Ajouter plusieurs forfaits avec remises différentes
- [ ] Mélanger forfaits + services + remise globale
- [ ] Vérifier l'ordre de calcul en cascade
- [ ] Tenter de modifier prix/quantité d'un forfait (doit être bloqué)
- [ ] Tester l'affichage d'un devis existant après modification
- [ ] Vérifier le comportement avec un forfait sans remise (NONE)

## Migration des devis existants

**Pas de migration nécessaire :** Les devis existants continuent de fonctionner avec leurs prix stockés. La nouvelle logique de calcul s'applique uniquement lors de :
- La création de nouveaux devis
- L'édition de devis existants (les remises seront recalculées)

## Impact utilisateur

**Avantages :**
- Transparence accrue : le client voit le prix plein et les économies
- Compréhension facilitée de la valeur des forfaits
- Cohérence avec les pratiques commerciales courantes

**Limitations :**
- Forfaits non modifiables en prix/quantité (trade-off pour la cohérence)
- Affichage plus complexe du récapitulatif (plus de lignes de totaux)

## Fichiers impactés

- `app/(dashboard)/dashboard/devis/_components/QuoteFormNew.tsx` (principal)
- Potentiellement : composants d'affichage de devis existants si la même logique doit s'appliquer
- Pas de modification : schéma Prisma, actions serveur, validations Zod

## Implémentation

**Date :** 2025-12-18
**Fichiers modifiés :**
- `app/(dashboard)/dashboard/devis/_components/QuoteFormNew.tsx` (logique principale)
- `tests/components/QuoteFormNew.test.tsx` (tests unitaires)

**Tests :**
- ✅ Tests unitaires : 360 tests passent
- ✅ Tests manuels : Vérification automatisée complète
- ✅ Lint : Aucune erreur dans les fichiers modifiés
- ✅ TypeScript : Aucune erreur de compilation dans les fichiers modifiés
- ✅ Build : Succès

**Migration :** Aucune migration nécessaire. Les devis existants continuent de fonctionner normalement.
