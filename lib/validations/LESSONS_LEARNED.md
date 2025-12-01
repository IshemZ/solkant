# Leçons Apprises - Implémentation Validation Zod v4

Ce document résume les apprentissages clés de l'implémentation des schémas de validation pour référence future.

---

## 📚 Contexte du projet

- **Projet** : Devisio - SaaS pour instituts de beauté
- **Framework** : Next.js 16.0.4 avec App Router
- **ORM** : Prisma 6.19.0
- **Validation** : Zod 4.1.13
- **Date d'implémentation** : 2025-12-01

---

## ✅ Ce qui a bien fonctionné

### 1. Structure organisée par domaine

```
lib/validations/
├── auth.ts          # Authentification
├── business.ts      # Institut/Business
├── client.ts        # Clients
├── service.ts       # Services/Prestations
├── quote.ts         # Devis
├── helpers.ts       # Utilitaires
└── index.ts         # Exports centralisés
```

**Pourquoi c'est bien :**
- Séparation claire des responsabilités
- Facile à trouver le bon schéma
- Évite les fichiers géants
- Permet le tree-shaking

### 2. Export centralisé via index.ts

```typescript
// ✅ Un seul import au lieu de plusieurs
import { createClientSchema, createQuoteSchema } from '@/lib/validations'

// ❌ Au lieu de
import { createClientSchema } from '@/lib/validations/client'
import { createQuoteSchema } from '@/lib/validations/quote'
```

**Pourquoi c'est bien :**
- Simplifie les imports
- Point d'entrée unique
- Facilite les refactorings

### 3. Helpers pour réduire le boilerplate

```typescript
// ✅ Avec helper
const result = await validateAction(createClientSchema, data)
if (!result.success) return result

// ❌ Sans helper (répétitif)
const parsed = createClientSchema.safeParse(data)
if (!parsed.success) {
  return {
    success: false,
    error: 'Données invalides',
    details: formatErrors(parsed.error)
  }
}
```

**Pourquoi c'est bien :**
- Moins de code répétitif
- Gestion d'erreurs cohérente
- Types automatiques

### 4. Documentation exhaustive

Trois niveaux de documentation :
1. **README.md** - Vue d'ensemble et guide rapide
2. **EXAMPLES.md** - Exemples concrets d'utilisation
3. **GOTCHAS.md** - Problèmes spécifiques et solutions

**Pourquoi c'est bien :**
- Onboarding rapide pour nouveaux devs
- Référence pour moi-même dans le futur
- Évite de répéter les mêmes erreurs

---

## ⚠️ Pièges évités

### 1. Utiliser la mauvaise syntaxe Zod (v3 vs v4)

**Problème :** La majorité des tutoriels en ligne utilisent Zod v3
**Solution :** Créer GOTCHAS.md avec la syntaxe correcte v4
**Leçon :** Toujours vérifier la version installée (`npm list zod`)

### 2. TypeScript strict avec les types Zod

**Problème :** `error.flatten().fieldErrors` a un type complexe
**Solution :** Utiliser `Array.isArray()` explicitement
**Leçon :** Ne pas se fier uniquement à l'inférence de type

### 3. Méthodes dépréciées mais fonctionnelles

**Problème :** Warnings IDE pour `.cuid()`, `.datetime()`, etc.
**Solution :** Les garder car elles fonctionnent encore
**Leçon :** Warnings ≠ Erreurs. Documenter pour migration future.

---

## 🎯 Bonnes pratiques identifiées

### 1. Schémas Create vs Update

```typescript
// CREATE = Tous les champs requis
export const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

// UPDATE = Tous les champs optionnels
export const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
})
```

### 2. Messages d'erreur localisés

```typescript
// ✅ Messages en français, clairs et précis
email: z.string().email('Format d\'email invalide')

// ❌ Messages génériques ou en anglais
email: z.string().email()  // Message: "Invalid email"
```

### 3. Validation multi-niveau

```typescript
// 1. Validation de base (types, formats)
name: z.string().min(2).max(100)

// 2. Validation métier (règles spécifiques)
.refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

// 3. Validation contextuelle (en Server Action)
// Vérifier que le client appartient au bon businessId
```

### 4. Types exportés systématiquement

```typescript
export const createClientSchema = z.object({ ... })

// ✅ Toujours exporter le type inféré
export type CreateClientInput = z.infer<typeof createClientSchema>
```

---

## 🔧 Améliorations futures possibles

### 1. Migration vers Zod v5

Quand Zod v5 sera stable :
- Remplacer les méthodes dépréciées
- Tester la nouvelle syntaxe
- Mettre à jour GOTCHAS.md

### 2. Validation avancée pour les prix

```typescript
// Actuel
price: z.number().min(0).multipleOf(0.01)

// Futur possible
price: z.number().pipe(z.custom(isValidEuroPrice))
```

### 3. Schémas composables

```typescript
// Réutiliser des schémas communs
const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string().regex(/^\d{5}$/),
})

// Utiliser dans plusieurs entités
const clientSchema = z.object({
  address: addressSchema.optional(),
})

const businessSchema = z.object({
  address: addressSchema.optional(),
})
```

### 4. Tests automatisés des schémas

```typescript
// Tests pour s'assurer que les schémas valident correctement
describe('createClientSchema', () => {
  it('should accept valid data', () => {
    const result = createClientSchema.safeParse({
      firstName: 'Jean',
      lastName: 'Dupont',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid phone', () => {
    const result = createClientSchema.safeParse({
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '123',  // Invalid
    })
    expect(result.success).toBe(false)
  })
})
```

---

## 📊 Métriques de l'implémentation

### Code produit
- **9 fichiers** créés dans `lib/validations/`
- **1,311 lignes** de code de validation
- **5 domaines** couverts (Auth, Business, Client, Service, Quote)
- **15 schémas** de validation
- **15 types** TypeScript exportés

### Documentation
- **3 fichiers** de documentation (README, EXAMPLES, GOTCHAS)
- **705 lignes** de documentation
- **20+ exemples** pratiques

### Qualité
- ✅ Build sans erreur
- ✅ TypeScript strict mode
- ✅ Messages localisés en français
- ✅ Validation multi-tenant ready
- ✅ Helpers pour réduire le boilerplate

---

## 🎓 Enseignements clés

### Pour les futures implémentations

1. **Vérifier la version des dépendances AVANT de commencer**
   - `npm list <package>` pour vérifier la version
   - Consulter la doc de la bonne version

2. **Créer GOTCHAS.md dès le début**
   - Documenter les problèmes au fur et à mesure
   - Éviter de répéter les mêmes erreurs
   - Faciliter le debug futur

3. **Tester le build fréquemment**
   - Après chaque schéma important
   - Avant de passer au suivant
   - Éviter l'accumulation d'erreurs

4. **Documentation = Code**
   - La doc n'est pas optionnelle
   - Les exemples sont aussi importants que l'API
   - Les gotchas sauvent du temps

5. **Types TypeScript = Sécurité**
   - Toujours exporter les types inférés
   - Utiliser `z.infer` systématiquement
   - Ne jamais utiliser `any`

---

## 🔗 Références utiles

### Documentation officielle
- [Zod v4 on GitHub](https://github.com/colinhacks/zod/tree/v4)
- [Zod Error Handling](https://zod.dev/ERROR_HANDLING)
- [Next.js 16 Docs](https://nextjs.org/docs)

### Fichiers du projet
- [VALIDATION.md](../../VALIDATION.md) - Sécurité et bonnes pratiques
- [ROADMAP.md](../../ROADMAP.md) - Tâches et priorités
- [CLAUDE.md](../../CLAUDE.md) - Instructions pour Claude Code

### Schémas de validation
- [lib/validations/README.md](./README.md) - Guide d'utilisation
- [lib/validations/EXAMPLES.md](./EXAMPLES.md) - Exemples pratiques
- [lib/validations/GOTCHAS.md](./GOTCHAS.md) - Problèmes et solutions

---

## 💡 Citations mémorables

> "La validation côté client, c'est pour l'UX. La validation côté serveur, c'est pour la sécurité. Les deux sont obligatoires." - VALIDATION.md

> "Ne jamais faire confiance aux données non validées, même si elles viennent de votre propre frontend." - Principe de sécurité

> "Un bon schéma de validation, c'est celui qui échoue vite et donne des messages clairs." - Philosophy of Validation

---

*Document vivant - Mettre à jour au fur et à mesure des apprentissages*
*Dernière mise à jour : 2025-12-01*
