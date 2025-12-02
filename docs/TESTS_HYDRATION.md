# 🧪 Tests d'Hydratation

Suite complète de tests garantissant l'absence d'erreurs d'hydratation React/Next.js.

## 📊 Résumé

- **51 tests** couvrant tous les aspects de l'hydratation
- **3 suites de tests** : date-utils, hydration, loading-states
- **100% de réussite** : validation complète de la solution

## 🚀 Exécution Rapide

```bash
# Tous les tests d'hydratation
npm run test:hydration

# Tests individuels
npm test -- tests/lib/date-utils.test.ts           # 10 tests
npm test -- tests/components/hydration.test.tsx    # 20 tests
npm test -- tests/components/loading-states.test.tsx # 21 tests
```

## 📁 Structure des Tests

### 1. `tests/lib/date-utils.test.ts` (10 tests)

**Objectif** : Valider que les fonctions de formatage de dates produisent des résultats identiques côté serveur et client.

**Tests clés** :

- ✅ Formatage cohérent en UTC
- ✅ Gestion des timezones
- ✅ Support des string ISO
- ✅ Edge cases (années bissextiles, dates invalides)
- ✅ Performance (< 10ms pour 1000 appels)

```typescript
// Exemple : Même résultat serveur/client
expect(formatDate("2024-12-02T10:30:00Z")).toBe("02/12/2024");
expect(formatDate(new Date("2024-12-02T10:30:00Z"))).toBe("02/12/2024");
```

### 2. `tests/components/hydration.test.tsx` (20 tests)

**Objectif** : Vérifier la cohérence serveur/client pour tous les patterns d'hydratation.

**Catégories** :

#### Date Formatting (5 tests)

- Cohérence UTC serveur/client
- Gestion timezone-safe
- Support Date objects et ISO strings

#### Tailwind Classes (2 tests)

- Classes déterministes (`bg-foreground/10`)
- Pas de variables CSS runtime

#### Anti-patterns Detection (3 tests)

- Détection de `Date.now()` (non déterministe)
- Détection de `Math.random()` (non déterministe)
- Démonstration des problèmes de `toLocaleDateString()`

#### Skeleton Loading States (2 tests)

- Classes Tailwind statiques uniquement
- HTML identique à chaque rendu

#### Real-world Examples (2 tests)

- Affichage de dates dans QuotesList
- Stats Cards avec Suspense

#### Edge Cases (4 tests)

- Dates invalides
- Début/fin d'année
- Années bissextiles
- Différents timezones

#### Performance (2 tests)

- Vitesse de formatage
- Pas de memory leaks

### 3. `tests/components/loading-states.test.tsx` (21 tests)

**Objectif** : Valider que tous les `loading.tsx` sont hydration-safe.

**Tests par composant** :

#### DashboardLoading (4 tests)

```typescript
✓ Rendu HTML identique à chaque fois
✓ Utilise bg-foreground/10 (pas bg-muted)
✓ Dimensions fixes pour skeletons
✓ Pas de contenu dynamique
```

#### DevisLoading (4 tests)

```typescript
✓ Rendu HTML identique
✓ Classes cohérentes
✓ 4 stats cards skeleton
✓ 4 quotes skeleton
```

#### ClientsLoading (3 tests)

```typescript
✓ Rendu HTML identique
✓ Classes cohérentes
✓ Tableau avec 5 lignes skeleton
```

#### ServicesLoading (4 tests)

```typescript
✓ Rendu HTML identique
✓ Classes cohérentes
✓ 6 filtres skeleton
✓ 6 services cards skeleton
```

#### Cross-component (2 tests)

```typescript
✓ Tous utilisent les mêmes classes de base
✓ Aucun ne contient de contenu dynamique
```

#### Accessibility (2 tests)

```typescript
✓ Structure HTML sémantique
✓ Contraste de couleurs suffisant
```

#### Performance (2 tests)

```typescript
✓ Rendu < 50ms pour 4 composants
✓ Rendu répété stable
```

## 🎯 Critères de Validation

Chaque test vérifie un ou plusieurs critères :

### ✅ Cohérence Serveur/Client

- Même HTML généré côté serveur et client
- Pas de différence de timezone/locale
- Fonctions pures et déterministes

### ✅ Pas d'Anti-patterns

- ❌ `Date.now()` → ✅ `formatDate()`
- ❌ `Math.random()` → ✅ Valeurs fixes
- ❌ `toLocaleDateString()` → ✅ UTC formatDate
- ❌ `bg-muted` (var CSS) → ✅ `bg-foreground/10`

### ✅ Performance

- Formatage rapide (< 10ms pour 1000 appels)
- Rendu des skeletons rapide (< 50ms)
- Pas de memory leaks

### ✅ Accessibilité

- HTML sémantique
- Contraste suffisant
- Structure valide

## 📈 Métriques

```
Test Files: 3 passed (3)
Tests:      51 passed (51)
Duration:   ~600ms
Coverage:   100% des fonctions critiques
```

## 🔍 Debug d'Hydratation

Si vous rencontrez une erreur d'hydratation :

### 1. Identifier la Source

```bash
# Console navigateur
Hydration failed because the server rendered HTML didn't match the client
```

### 2. Vérifier les Anti-patterns

```typescript
// ❌ BAD - Cause des mismatches
<div>{new Date().toLocaleDateString("fr-FR")}</div>
<div>{Date.now()}</div>
<div>{Math.random()}</div>
<div className="bg-muted" /> // Variable CSS

// ✅ GOOD - Déterministe
<div>{formatDate(date)}</div>
<div>{timestamp}</div>
<div>{fixedValue}</div>
<div className="bg-foreground/10" /> // Opacité statique
```

### 3. Exécuter les Tests

```bash
npm run test:hydration
```

### 4. Ajouter un Test

Si vous trouvez un nouveau cas, ajoutez un test :

```typescript
// tests/components/hydration.test.tsx
it("mon nouveau composant devrait être hydration-safe", () => {
  const { container: c1 } = render(<MonComposant />);
  const { container: c2 } = render(<MonComposant />);

  expect(c1.innerHTML).toBe(c2.innerHTML);
});
```

## 📚 Références

- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Documentation complète](./HYDRATION_FIX.md)

## 🎓 Apprentissages Clés

1. **Toujours utiliser UTC** pour les dates dans les Server Components
2. **Classes Tailwind statiques** > Variables CSS pour les skeletons
3. **Fonctions pures** pour tout ce qui est rendu serveur + client
4. **Tester systématiquement** la cohérence serveur/client
5. **Éviter les anti-patterns** : Date.now(), Math.random(), toLocaleDateString()

---

**Dernière mise à jour** : 2 décembre 2025  
**Status** : ✅ 51/51 tests passent
