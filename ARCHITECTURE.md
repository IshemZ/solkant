# ARCHITECTURE.md

## Application Overview

Devisio est une application SaaS moderne destinée aux instituts de beauté pour générer rapidement des devis professionnels. Elle est construite avec Next.js 16 (App Router), React 19, TypeScript, Prisma, et Tailwind CSS v4. L'architecture est centrée sur la performance, la simplicité, la maintenabilité et une esthétique adaptée à l'industrie de la beauté.

## Structure de l'application (Next.js App Router)

```
app/
├── layout.tsx              # Layout racine (polices, lang, metadata)
├── page.tsx                # Page d'accueil (composant serveur)
├── globals.css             # Styles globaux
├── (auth)/                 # Groupe de routes pour auth (non protégées)
│   ├── login/
│   └── register/
├── (dashboard)/            # Groupe de routes protégées (dashboard)
│   ├── layout.tsx
│   ├── dashboard/
│   ├── quotes/
│   ├── clients/
│   └── services/
├── api/                    # Routes API (NextAuth, webhooks)
│   └── auth/[...nextauth]/
├── actions/                # Server Actions (CRUD sécurisé)
└── error.tsx, loading.tsx  # Gestion d'erreurs et chargement

components/                 # Composants UI réutilisables
├── auth/, quotes/, clients/, services/, layout/, ui/

lib/                        # Logique partagée et configuration
├── prisma.ts, auth.ts, utils.ts, env.ts

prisma/                     # Schéma et migrations Prisma
├── schema.prisma, migrations/

public/                     # Fichiers statiques

scripts/                    # Scripts utilitaires (migration, fix, etc.)

types/                      # Types TypeScript (ex: NextAuth override)
```

## Principes Clés de l'Architecture

- **Server-First** : Composants serveur par défaut pour meilleure performance et sécurité
- **Client Components** : Utilisés uniquement pour interactions (ex: formulaires, boutons)
- **Server Actions** : Préférées aux routes API pour les mutations CRUD
- **NextAuth** : Authentification centralisée avec callbacks sécurisés
- **Prisma + Supabase** : ORM type-safe et base de données PostgreSQL hébergée
- **Colocation** : Fichiers organisés par domaine (quotes, clients, etc.)
- **App Router** : Unifie backend et frontend avec conventions modernes

## Alias de Chemin

- Utilise `@/*` dans `tsconfig.json` pour pointer vers la racine du projet

## Styling System

- Tailwind CSS v4 + PostCSS
- Couleurs personnalisées via CSS variables : `--background`, `--foreground`
- Thème : beige clair et brun doux (esthétique beauté)
- Support du mode sombre via `prefers-color-scheme`
- Polices : Geist Sans / Mono avec `next/font`

## Configuration TypeScript

- Mode strict activé
- Ciblage ES2017
- Compilation incrémentale
- Résolution via bundler
- JSX: `react-jsx` (support React 19)

## Conventions de Composants et Fichiers

- Composants : PascalCase (`QuoteCard.tsx`, `LoginForm.tsx`)
- Actions Serveur : `app/actions/{entity}.ts`
- Utilitaires : camelCase (`utils.ts`, `logger.ts`)
- Types globaux : `types/`
- Constantes : `constants.ts`
- Tests : co-localisés (`QuoteCard.test.tsx`)

## Sécurité intégrée à l'architecture

- Authentification via NextAuth (session JWT + callbacks)
- Validation d'input avec Zod (schémas dans `lib/validations/`)
- Middleware d'authentification (layout/dashboard protégé)
- Multi-tenancy avec `businessId` injecté dans la session
- Filtrage des données via middleware Prisma
- Séparation des environnements via variables `.env` et Vercel

## Récapitulatif

| Composant      | Technologie       |
|----------------|-------------------|
| Frontend       | React 19, Tailwind v4 |
| Backend        | Next.js App Router, Server Actions |
| Authentification | NextAuth (Google + Credentials) |
| BDD            | Supabase (PostgreSQL) via Prisma |
| ORM            | Prisma v6.19.0 |
| Hébergement    | Vercel (déploiement continu) |

---

Pour plus d’informations détaillées sur le workflow de développement, les schémas de validation, et les tâches prioritaires, voir :

- `WORKFLOW.md`
- `VALIDATION.md`
- `ROADMAP.md`
- `AUTH.md`

