# Gotchas et Problèmes Rencontrés - Validation Zod

Ce fichier documente les problèmes techniques rencontrés lors de l'implémentation des schémas de validation Zod et leurs solutions.

---

## 🔴 Problème majeur : Zod v4 vs v3 - Syntaxe différente

### Contexte
Le projet utilise **Zod v4.1.13**, qui a une syntaxe différente de Zod v3 (la version la plus documentée en ligne).

### ❌ Erreur rencontrée

```typescript
// ❌ INCORRECT - Syntaxe Zod v3 (ne fonctionne PAS avec v4)
price: z.number({
  required_error: 'Le prix est requis',
  invalid_type_error: 'Le prix doit être un nombre',
})
```

**Erreur TypeScript :**
```
Property 'required_error' does not exist in type '{ error?: string | ... }'
Property 'invalid_type_error' does not exist in type '{ error?: string | ... }'
```

### ✅ Solution

```typescript
// ✅ CORRECT - Syntaxe Zod v4
price: z.number('Le prix doit être un nombre')
  .min(0, 'Le prix ne peut pas être négatif')
```

**Règle :** Dans Zod v4, le message d'erreur de type se passe directement comme paramètre string à `.number()`, `.string()`, etc.

---

## 🟡 Problème : Types des erreurs flatten

### ❌ Erreur rencontrée

```typescript
// ❌ INCORRECT - TypeScript ne peut pas inférer le type
Object.entries(flattened.fieldErrors).forEach(([key, messages]) => {
  if (messages && messages.length > 0) {  // ❌ Property 'length' does not exist
    formattedErrors[key] = messages[0]
  }
})
```

**Erreur TypeScript :**
```
Property 'length' does not exist on type '{}'.
```

### ✅ Solution

```typescript
// ✅ CORRECT - Vérifier explicitement que c'est un tableau
Object.entries(flattened.fieldErrors).forEach(([key, messages]) => {
  if (Array.isArray(messages) && messages.length > 0) {
    formattedErrors[key] = messages[0]
  }
})
```

**Règle :** Toujours utiliser `Array.isArray()` pour vérifier les types avant d'accéder aux propriétés d'array.

---

## 🟡 Problème : Méthodes dépréciées dans Zod v4

### ⚠️ Avertissement rencontré

```typescript
// ⚠️ Méthodes dépréciées mais toujours fonctionnelles
.cuid('Message')      // Déprécié
.datetime('Message')  // Déprécié
.regex(/pattern/)     // Déprécié
.flatten()            // Déprécié
```

**Avertissement IDE :**
```
'cuid' is deprecated
'datetime' is deprecated
'regex' is deprecated
'flatten' is deprecated
```

### ✅ Solution actuelle (fonctionnelle)

Ces méthodes **fonctionnent encore** dans Zod v4.1.13, donc nous les utilisons pour le moment.

### 🔮 Migration future recommandée

Lorsque Zod v5 sera stable, considérer la migration vers :
- `.cuid()` → Possiblement remplacé par une autre validation d'ID
- `.datetime()` → Nouvelle syntaxe à déterminer
- `.regex()` → Possiblement `.pattern()` ou autre
- `.flatten()` → Nouvelle méthode de formatage d'erreurs

**Règle :** Pour l'instant, ignorer ces warnings tant que le code compile et fonctionne.

---

## 🟢 Syntaxe correcte pour Zod v4 - Référence rapide

### Strings

```typescript
// ✅ CORRECT
z.string()
  .min(1, 'Requis')
  .max(100, 'Trop long')
  .email('Email invalide')
  .toLowerCase()
  .trim()
  .optional()
  .nullable()
```

### Numbers

```typescript
// ✅ CORRECT
z.number('Doit être un nombre')  // Message d'erreur de type
  .min(0, 'Minimum 0')
  .max(999999.99, 'Maximum dépassé')
  .int('Doit être entier')
  .multipleOf(0.01, 'Max 2 décimales')
  .optional()
  .nullable()
  .default(0)
```

### Booleans

```typescript
// ✅ CORRECT
z.boolean()
  .default(true)
  .optional()
```

### Enums

```typescript
// ✅ CORRECT
const statusEnum = z.enum(['DRAFT', 'SENT', 'ACCEPTED'])
  .default('DRAFT')
  .optional()
```

### Arrays

```typescript
// ✅ CORRECT
z.array(itemSchema)
  .min(1, 'Au moins 1 élément requis')
  .max(100, 'Maximum 100 éléments')
  .optional()
```

### Objets avec refine

```typescript
// ✅ CORRECT
z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],  // Associer l'erreur au bon champ
})
```

---

## 📋 Checklist pour éviter les erreurs

Avant de créer un nouveau schéma Zod :

- [ ] ✅ Utiliser `.number('message')` et non `{ invalid_type_error: '...' }`
- [ ] ✅ Utiliser `.string()` et non `{ required_error: '...' }`
- [ ] ✅ Utiliser `Array.isArray()` pour vérifier les tableaux
- [ ] ✅ Messages d'erreur en français
- [ ] ✅ `.trim()` sur tous les champs texte
- [ ] ✅ `.toLowerCase()` sur les emails
- [ ] ✅ Tester le build avec `npm run build`
- [ ] ✅ Exporter les types avec `z.infer<typeof schema>`

---

## 🔍 Commandes de débogage utiles

```bash
# Vérifier la version de Zod installée
npm list zod

# Tester la compilation TypeScript
npm run build

# Vérifier les erreurs TypeScript uniquement
npx tsc --noEmit

# Linter les fichiers
npm run lint
```

---

## 📚 Ressources

- [Zod v4 Documentation](https://github.com/colinhacks/zod/tree/v4) - Branche v4 sur GitHub
- [Migration Guide v3 → v4](https://github.com/colinhacks/zod/releases) - Notes de release
- [Zod Errors Guide](https://zod.dev/ERROR_HANDLING) - Gestion des erreurs

---

## 🎯 Patterns à suivre dans ce projet

### 1. Schémas Create vs Update

```typescript
// CREATE - Champs requis
export const createClientSchema = z.object({
  firstName: z.string().min(2),  // Requis
  lastName: z.string().min(2),   // Requis
})

// UPDATE - Tous optionnels
export const updateClientSchema = z.object({
  firstName: z.string().min(2).optional(),  // Optionnel
  lastName: z.string().min(2).optional(),   // Optionnel
})
```

### 2. Export des types

```typescript
// Toujours exporter les types inférés
export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
```

### 3. Validation des formats français

```typescript
// Téléphone français
phone: z.string()
  .regex(
    /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    'Numéro de téléphone invalide (format français attendu)'
  )

// SIRET (14 chiffres)
siret: z.string()
  .regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres')

// Couleur hexadécimale
primaryColor: z.string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Format hexadécimal attendu')
```

### 4. Structure des fichiers de validation

```
lib/validations/
├── auth.ts          # Schémas d'authentification
├── business.ts      # Schémas Business
├── client.ts        # Schémas Client
├── service.ts       # Schémas Service
├── quote.ts         # Schémas Quote
├── helpers.ts       # Utilitaires de validation
├── index.ts         # Exports centralisés
├── README.md        # Documentation
├── EXAMPLES.md      # Exemples d'utilisation
└── GOTCHAS.md       # Ce fichier
```

---

## ⚠️ Points de vigilance

1. **Ne jamais utiliser la syntaxe Zod v3** trouvée dans la plupart des tutoriels en ligne
2. **Toujours vérifier `Array.isArray()`** avant d'accéder à `.length`
3. **Les méthodes dépréciées fonctionnent encore** - ne pas paniquer pour les warnings
4. **Tester le build** après chaque modification importante
5. **Messages en français** - respecter la langue du projet
6. **Validation côté serveur obligatoire** - même avec validation client

---

*Dernière mise à jour : 2025-12-01*
*Zod version : 4.1.13*
*Next.js version : 16.0.4*
