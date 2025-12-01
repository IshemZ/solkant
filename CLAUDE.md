# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

Ce fichier donne une vue d'ensemble de Devisio et pointe vers les documents complémentaires.

> **IMPORTANT pour Claude Code**: Tous les fichiers `.md` listés ci-dessous font partie du contexte permanent du projet. Lors de chaque session, consulter ces fichiers pour comprendre l'architecture, les workflows, les priorités et les conventions du projet.

## 📘 Fichiers de documentation (Contexte Permanent)

- [`ARCHITECTURE.md`](ARCHITECTURE.md) – Structure du projet, conventions, stack technique
- [`WORKFLOW.md`](WORKFLOW.md) – Flux de travail Git, commandes, déploiement
- [`UX.md`](UX.md) – Audit UX, recommandations et roadmap UI
- [`ROADMAP.md`](ROADMAP.md) – Tâches prioritaires, TODOs, avancement
- [`VALIDATION.md`](VALIDATION.md) – Validation des entrées, sécurité, Zod
- [`AUTH.md`](AUTH.md) – Auth.js, OAuth, gestion de session

---

## Projet Devisio – Vue d'ensemble

**Nom** : Devisio  
**Description** :  
Devisio est une plateforme SaaS conçue pour les instituts de beauté afin de faciliter la création de devis professionnels. Elle permet de générer rapidement des PDF personnalisés, de gérer les clients et services, le tout avec une interface élégante.

**Objectifs principaux** :

- Générer instantanément des devis PDF avec branding
- Maintenir une esthétique raffinée (tons beiges, design épuré)
- Outils intuitifs pour gérer les clients et les prestations
- Optimisation desktop-first avec interactions fluides

**Utilisateurs cibles** :

- Gérants d'instituts ou salons de beauté (indépendants)
- Besoin d'un outil simple et professionnel, sans complexité d'un ERP

## Stack Technique

- **Framework** : Next.js 16.0.4 (App Router)
- **React** : v19.2.0
- **TypeScript** : v5 (strict mode activé)
- **Styling** : Tailwind CSS v4 + PostCSS
- **Fonts** : Geist Sans et Geist Mono via `next/font/google`
- **Base de données** : Supabase (PostgreSQL)
- **ORM** : Prisma v6 (6.19.0)
- **Auth** : NextAuth (Auth.js v5)

> 🛠️ Pour les détails sur l'architecture technique, voir [`ARCHITECTURE.md`](ARCHITECTURE.md)
> 🔐 Pour la configuration d'authentification, voir [`AUTH.md`](AUTH.md)
> 🧪 Pour la validation des données, voir [`VALIDATION.md`](VALIDATION.md)

---

## 🛠️ Common Development Commands

### Development Server

```bash
npm run dev          # Start Next.js dev server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database (Prisma)

```bash
npx prisma migrate dev           # Create and apply new migration in development
npx prisma migrate deploy        # Deploy migrations to production (use in CI/CD)
npx prisma studio                # Open Prisma Studio GUI to browse database
npx prisma generate              # Regenerate Prisma Client (after schema changes)
npx prisma db push               # Push schema changes without migration (dev only)
```

### Scripts

```bash
npx tsx scripts/fix-missing-business.ts    # Fix users without Business records (one-time utility)
```

### Important Notes

- Always run `npx prisma generate` after pulling schema changes from git
- **DATABASE_URL** (port 6543 with pgbouncer) is used for app runtime (pooled connection)
- **DIRECT_URL** (port 5432) is used for Prisma CLI migrations (direct connection)
- See [.env.example](.env.example) for required environment variables

---

## 📊 Current Implementation Status

### ✅ Fully Implemented

- **Authentication**: NextAuth with Google OAuth + Credentials (email/password)
- **Database Schema**: Complete Prisma schema with all models deployed to Supabase
- **Landing Page**: Professional homepage with hero, features, and CTAs
- **Protected Routes**: Dashboard layout with auth guard and automatic redirects
- **User Registration**: Email/password and Google OAuth registration flows
- **Multi-tenant Data Model**: All tables include `businessId` for tenant isolation

### 🚧 In Progress / Partial

- **Multi-tenant Session**: `businessId` added to session for automatic query filtering
- **Business Auto-creation**: Automatic Business entity creation for both OAuth and credentials registration

### ❌ Not Yet Implemented

- **Quotes Management**: UI and backend for creating/managing quotes (high priority)
- **Clients Management**: UI and backend for client records (high priority)
- **Services Management**: UI and backend for service catalog (high priority)
- **Server Actions**: CRUD operations via Server Actions (planned migration from API routes)
- **Zod Validation**: Centralized validation schemas in `lib/validations/`
- **Shared UI Components**: Reusable component library in `components/ui/`
- **Error Handling**: Structured logging and error boundaries

---

## 🗄️ Database Models

The database uses **multi-tenant architecture** with `businessId` isolation:

**Core Models:**

- `User` (1:1 Business) - Authentication and user account
- `Business` - Tenant/Institute profile (one per user)
- `Client` - Customer records (belongs to Business)
- `Service` - Service catalog (belongs to Business)
- `Quote` - Quotation documents (belongs to Business + Client)
- `QuoteItem` - Line items in quotes (many-to-one Quote)

**NextAuth Models:**

- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

**Multi-Tenancy:**

All business data models include `businessId` foreign key for tenant isolation. The session now includes `businessId` to automatically filter queries.

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema definition.

---

## 🎨 Design System

- **Primary Color**: `#D4B5A0` (beige clair - beauty industry aesthetic)
- **Secondary Color**: `#8B7355` (brun élégant)
- **Fonts**: Geist Sans & Geist Mono via `next/font`
- **Dark Mode**: Supported via `prefers-color-scheme`
- **CSS Variables**: `--background`, `--foreground` in `globals.css`

---

## 🔐 Security & Multi-Tenancy

**Critical Security Practices:**

- All Prisma queries MUST filter by `businessId` from session
- Server Actions MUST validate session and extract `businessId`
- Input validation via Zod schemas (in progress)
- Passwords hashed with bcryptjs (12 rounds)
- CSRF protection via NextAuth

**Session Structure:**

```typescript
session.user.id         // User ID
session.user.businessId // Business ID (for tenant isolation)
session.user.email      // User email
session.user.name       // User name
```
