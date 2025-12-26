# Tests Antipatterns

Ce dossier contient des tests qui détectent des **antipatterns** (mauvaises pratiques) communs dans le code.

## Qu'est-ce qu'un test antipattern ?

Un test antipattern est un test qui :
1. **Détecte un bug avant qu'il n'arrive en production**
2. **Documente les erreurs courantes** à éviter
3. **Enseigne les bonnes pratiques** aux développeurs

Contrairement aux tests unitaires classiques qui testent la logique métier, les tests antipatterns testent des **cas limites et des erreurs de programmation courantes**.

## Tests Disponibles

### 1. `nan-in-input-attributes.test.tsx`

**Problème détecté**: Attributs HTML des inputs qui reçoivent `NaN`

**Symptôme**:
```
Warning: Received NaN for the `max` attribute. If this is expected, cast the value to a string.
```

**Cause commune**:
- Calculs qui retournent `NaN` au chargement initial
- Données non disponibles lors du render
- `parseFloat()` ou `parseInt()` sur valeurs invalides sans fallback

**Solution**:
```typescript
// ❌ BAD: NaN peut être passé à max
<Input max={subtotal} />

// ✅ GOOD: Validation avec Number.isFinite()
<Input max={Number.isFinite(subtotal) ? subtotal : undefined} />
```

**Scénarios testés**:
- ✅ Subtotal = NaN
- ✅ Subtotal = undefined
- ✅ Subtotal = 0 (valide)
- ✅ Subtotal négatif
- ✅ Type PERCENTAGE (max=100)
- ✅ parseFloat/parseInt sans fallback
- ✅ Opérations arithmétiques qui produisent NaN
- ✅ Calculs de totaux et remises

## Comment Utiliser ces Tests

### 1. Exécuter tous les tests antipatterns

```bash
npm test -- tests/antipatterns/
```

### 2. Exécuter un test spécifique

```bash
npm test -- tests/antipatterns/nan-in-input-attributes.test.tsx
```

### 3. Ajouter un nouveau test antipattern

1. Créer un fichier `tests/antipatterns/my-antipattern.test.tsx`
2. Documenter le problème en commentaire au début du fichier
3. Créer des tests qui détectent l'antipattern
4. Ajouter des recommandations en fin de fichier
5. Mettre à jour ce README

## Recommandations Générales

### Éviter NaN dans les Inputs

```typescript
// ❌ BAD
const price = parseFloat(input);
const quantity = parseInt(input);

// ✅ GOOD
const price = parseFloat(input) || 0;
const quantity = parseInt(input) || 1;

// ✅ BETTER
const price = Number.isFinite(parseFloat(input)) ? parseFloat(input) : 0;
```

### Valider les Attributs Calculés

```typescript
// ❌ BAD
<Input
  type="number"
  min={minValue}
  max={maxValue}
  step={stepValue}
/>

// ✅ GOOD
<Input
  type="number"
  min={Number.isFinite(minValue) ? minValue : undefined}
  max={Number.isFinite(maxValue) ? maxValue : undefined}
  step={Number.isFinite(stepValue) ? stepValue : undefined}
/>
```

### Initialiser les États avec des Valeurs Valides

```typescript
// ❌ BAD - subtotal peut être undefined
const [subtotal, setSubtotal] = useState<number>();

// ✅ GOOD - subtotal initialisé à 0
const [subtotal, setSubtotal] = useState<number>(0);
```

### Protéger les Calculs

```typescript
// ❌ BAD - division par zéro = NaN
const ratio = a / b;

// ✅ GOOD
const ratio = b !== 0 ? a / b : 0;

// ✅ BETTER - valider le résultat
const calculateRatio = (a: number, b: number): number => {
  if (b === 0) return 0;
  const result = a / b;
  return Number.isFinite(result) ? result : 0;
};
```

## Philosophie

Les tests antipatterns suivent le principe **"Fail Fast, Learn Fast"** :

1. **Détection précoce**: Le bug est détecté en développement, pas en production
2. **Documentation vivante**: Le test documente le problème et la solution
3. **Prévention**: Empêche la réintroduction du même bug
4. **Éducation**: Forme l'équipe aux bonnes pratiques

## Quand Ajouter un Test Antipattern ?

Ajoutez un test antipattern quand :

- ✅ Un bug est découvert en production
- ✅ Un warning React/Browser apparaît régulièrement
- ✅ Un pattern de code dangereux est identifié
- ✅ Une erreur est répétée par plusieurs développeurs
- ✅ Un cas limite cause des comportements inattendus

## Contribution

Pour contribuer un nouveau test antipattern :

1. Identifier un antipattern réel rencontré dans le projet
2. Créer un test qui le détecte
3. Documenter le problème et la solution
4. Ajouter des exemples concrets
5. Mettre à jour ce README

## Ressources

- [React Warnings Guide](https://react.dev/warnings)
- [JavaScript NaN MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)
- [Number.isFinite() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite)
