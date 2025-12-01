# VALIDATION.md – Schémas, Sécurité & Bonnes Pratiques

Ce fichier documente les conventions de validation des données pour Devisio. L’objectif est de garantir l’intégrité des entrées utilisateur, d’assurer la sécurité applicative et d’offrir des messages d’erreurs clairs et localisés.

---

## 🎯 Objectifs

- Sécuriser toutes les entrées utilisateur (auth, client, service, devis...)
- Offrir une validation centralisée et typée (Zod)
- Fournir des messages localisés (français)
- Prévenir les injections SQL et attaques XSS

---

## 📁 Organisation du Dossier

Tous les schémas sont placés dans `lib/validations/`

| Fichier            | Validation liée à...    |
|--------------------|--------------------------|
| `auth.ts`          | Connexion / Inscription  |
| `business.ts`      | Profil institut           |
| `client.ts`        | Clients                   |
| `service.ts`       | Prestations               |
| `quote.ts`         | Devis                     |

---

## ✅ Exemple : Schéma d’inscription

```ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').trim(),
  email: z.string().email('Email invalide').toLowerCase().trim(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})
```

---

## 🔐 Bonnes pratiques de validation

- Toujours trim les champs texte (`.trim()`)
- Emails forcés en lowercase (`.toLowerCase()`)
- Schéma Zod => types TS avec `z.infer<typeof schema>`
- Localiser tous les messages d’erreur (FR)

### Application des schémas

| Contexte         | Utilisation                  |
|------------------|------------------------------|
| Server Actions   | Directement avec `z.parse`   |
| API Routes       | Middleware / guards Zod      |
| Formulaires UI   | Client-side (React Hook Form ou `zodResolver`)

---

## 🔎 Sécurité complémentaire

- Utiliser Prisma avec requêtes paramétrées (pas de SQL brut)
- Vérifier systématiquement la session NextAuth
- Encodage systématique des entrées si rendu (`dangerouslySetInnerHTML`) évité

---

## 🔁 Liens utiles

- [`AUTH.md`](AUTH.md)
- [`UX.md`](UX.md)
- [`ROADMAP.md`](ROADMAP.md)

---

*Dernière mise à jour : 2025-12-01*

