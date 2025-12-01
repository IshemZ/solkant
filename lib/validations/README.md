# Schémas de Validation Zod

Ce dossier contient tous les schémas de validation Zod pour l'application Devisio.

## 📁 Structure

```
lib/validations/
├── index.ts         # Exports centralisés
├── auth.ts          # Validation pour l'authentification
├── business.ts      # Validation pour les Business/Instituts
├── client.ts        # Validation pour les Clients
├── service.ts       # Validation pour les Services
├── quote.ts         # Validation pour les Devis
└── README.md        # Ce fichier
```

## 🎯 Utilisation

### Import des schémas

```typescript
// Import depuis le fichier index centralisé (recommandé)
import { loginSchema, createClientSchema } from '@/lib/validations'

// Ou import direct depuis le fichier spécifique
import { loginSchema } from '@/lib/validations/auth'
```

### Validation côté serveur (Server Actions)

```typescript
import { createClientSchema, type CreateClientInput } from '@/lib/validations'

export async function createClient(data: CreateClientInput) {
  // Validation avec Zod
  const validated = createClientSchema.parse(data)

  // Ou avec gestion d'erreur
  const result = createClientSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.flatten() }
  }

  // Utiliser result.data qui est typé et validé
  await prisma.client.create({
    data: {
      ...result.data,
      businessId: await getBusinessId(),
    },
  })
}
```

### Validation côté client (React Hook Form)

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations'

function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    // data est déjà validé par le schema
    await signIn('credentials', data)
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

## 📋 Schémas disponibles

### Authentication (`auth.ts`)

- `loginSchema` - Connexion utilisateur
- `registerSchema` - Inscription utilisateur

### Business (`business.ts`)

- `createBusinessSchema` - Création d'un institut
- `updateBusinessSchema` - Mise à jour d'un institut

### Client (`client.ts`)

- `createClientSchema` - Création d'un client
- `updateClientSchema` - Mise à jour d'un client

### Service (`service.ts`)

- `createServiceSchema` - Création d'un service
- `updateServiceSchema` - Mise à jour d'un service
- `serviceCategories` - Liste des catégories prédéfinies

### Quote (`quote.ts`)

- `createQuoteSchema` - Création d'un devis
- `updateQuoteSchema` - Mise à jour d'un devis
- `updateQuoteStatusSchema` - Mise à jour du statut uniquement
- `quoteItemSchema` - Validation d'une ligne de devis
- `quoteStatusEnum` - Enum des statuts possibles

## 🔒 Règles de validation

### Formats

- **Email** : Format email valide, converti en minuscules, trimé
- **Téléphone** : Format français attendu (ex: 06 12 34 56 78, +33 6 12 34 56 78)
- **SIRET** : Exactement 14 chiffres
- **Couleur** : Format hexadécimal (#RRGGBB ou #RGB)
- **Prix** : Nombre positif, max 2 décimales, max 999 999,99 €

### Longueurs

- **Nom/Prénom** : 2-50 caractères
- **Email** : Format email valide
- **Mot de passe** : Minimum 8 caractères + 1 majuscule + 1 minuscule + 1 chiffre
- **Notes** : Max 5000 caractères
- **Description** : Max 500-1000 caractères selon le contexte

### Sécurité

- Tous les champs texte sont **trimés** pour éviter les espaces parasites
- Les emails sont forcés en **lowercase**
- Validation des types (évite les injections)
- Messages d'erreur localisés en français

## 🛡️ Bonnes pratiques

1. **Toujours valider côté serveur** même si validation côté client existe
2. **Utiliser `.safeParse()`** pour gérer les erreurs gracieusement
3. **Typer les inputs** avec `z.infer<typeof schema>` ou les types exportés
4. **Ne jamais faire confiance aux données non validées**
5. **Valider AVANT** d'utiliser les données dans Prisma

## 📚 Ressources

- [Documentation Zod](https://zod.dev)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [VALIDATION.md](../../VALIDATION.md) - Guide de sécurité du projet

---

*Dernière mise à jour : 2025-12-01*
