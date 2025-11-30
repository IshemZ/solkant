# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview – Devisio (SaaS for Beauty Institutes)

**Name**: Devisio  
**Description**:  
Devisio is a modern SaaS platform designed specifically for beauty institutes to streamline the creation of professional quotes (devis). It enables quick and elegant quote generation, client and service management, and the export of branded PDF documents with minimal effort.

Built with Next.js 16 (App Router), TypeScript, React 19, and Tailwind CSS v4, Devisio prioritizes speed, simplicity, and design aesthetics aligned with the beauty industry.

**Core Objectives**:

- Enable instant generation of branded PDF quotes
- Maintain a consistent, elegant design theme (neutral beige tones, clean layout)
- Provide intuitive tools to manage clients and services
- Optimize for desktop-first experience with fast and fluid interactions

**Target Users**:

- Independent beauty institutes and salons
- Typically managed by a single owner or business manager
- Users who need a streamlined, professional quoting system without the complexity of larger ERP solutions

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production application
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 16.0.4 with App Router
- **React**: v19.2.0
- **TypeScript**: v5 with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`

## Architecture

### App Structure

The application follows Next.js 16 App Router conventions, which unifies frontend and backend in a single framework:

**Frontend/Backend Unified Structure:**

```
app/
├── layout.tsx              # Root layout (font config, metadata)
├── page.tsx                # Homepage (Server Component by default)
├── globals.css             # Global styles (Tailwind + CSS variables)
├── (auth)/                 # Route group for authentication pages
│   ├── login/
│   └── register/
├── (dashboard)/            # Route group for protected dashboard
│   ├── layout.tsx          # Dashboard layout with sidebar/nav
│   ├── quotes/             # Quote management
│   ├── clients/            # Client management
│   └── services/           # Service catalog
├── api/                    # API Routes (backend endpoints)
│   ├── auth/[...nextauth]/ # NextAuth endpoints
│   └── webhooks/           # External webhooks if needed
└── actions/                # Server Actions (recommended for mutations)
    ├── quotes.ts           # Quote-related server actions
    ├── clients.ts          # Client-related server actions
    └── services.ts         # Service-related server actions

public/                     # Static assets (images, SVGs, PDFs)
prisma/                     # Database schema and migrations
├── schema.prisma
└── migrations/

lib/                        # Shared utilities
├── prisma.ts              # Prisma client instance
├── auth.ts                # NextAuth configuration
└── utils.ts               # Helper functions

components/                 # Reusable UI components
├── ui/                    # Base UI components (buttons, inputs, etc.)
├── quotes/                # Quote-specific components
├── clients/               # Client-specific components
└── layout/                # Layout components (header, sidebar, etc.)
```

**Key Concepts:**

- **Server Components (default)**: All components in `app/` are Server Components by default
  - Direct database access
  - No JavaScript sent to client
  - Better performance and SEO

- **Client Components**: Use `"use client"` directive when needed
  - Interactive components (forms with state, onClick handlers)
  - Browser-only APIs (localStorage, window, etc.)
  - Third-party libraries that require client-side execution

- **Server Actions**: Replace traditional API routes for mutations
  - File: `app/actions/*.ts`
  - Direct database mutations with Prisma
  - Automatic revalidation and cache management

- **API Routes**: Use only for:
  - NextAuth endpoints (`/api/auth/[...nextauth]`)
  - External webhooks
  - Third-party integrations

- **Route Groups**: Use `(folder)` syntax for organization without affecting URL structure
  - `(auth)` for login/register pages
  - `(dashboard)` for protected app pages

### Path Aliases

The project uses `@/*` as an alias for the root directory (configured in tsconfig.json).

### Styling System

Uses Tailwind CSS v4 with the new `@theme inline` directive in globals.css for custom design tokens. The theme includes:

- CSS custom properties for `--background` and `--foreground` colors
- Dark mode support via `prefers-color-scheme`
- Custom font tokens mapped to Geist fonts

### TypeScript Configuration

- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- JSX set to `react-jsx` (using React 19's automatic JSX runtime)
- Incremental compilation enabled

### ESLint Configuration

Uses Next.js ESLint presets:

- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Build artifacts (`.next/`, `out/`, `build/`) are ignored.

## Workflow

### Branch Naming Conventions

Use the following prefixes for branch names:

- `feature/*` - New features or enhancements
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes
- `release/*` - Release preparation branches

### Deployment Process

- **Platform**: Vercel
- **Environments**:
  - **Production**: `main` branch → Auto-deploys to production (live website)
  - **Staging**: `develop` branch → Auto-deploys to staging environment for testing
  - **Preview**: Feature branches → Unique preview URLs for each PR

**Deployment Flow**:

- Push to `develop` → Vercel creates staging deployment
- Push to `main` → Vercel deploys to production
- Push any feature branch → Vercel creates preview deployment with unique URL

### Development Workflow

**Important**: Never push directly to `main`. Always go through `develop` first.

#### For New Features:

1. **Start from develop branch**

   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Develop and test locally**

   ```bash
   npm run dev  # Test at http://localhost:3000
   npm run lint # Check for linting issues
   ```

4. **Commit and push feature branch**

   ```bash
   git add .
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Test on Vercel Preview**
   - Vercel automatically creates a preview deployment
   - Test on the unique preview URL provided by Vercel
   - Verify everything works as expected

6. **Merge to develop for staging**

   ```bash
   git checkout develop
   git merge feature/your-feature-name
   git push origin develop
   ```

   - Vercel deploys to staging environment
   - Perform full testing on staging

7. **Deploy to production when ready**

   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

   - Only merge to `main` when `develop` is stable and fully tested
   - This triggers production deployment

#### For Bug Fixes:

- Use `fix/` prefix: `git checkout -b fix/bug-description`
- Follow same workflow as features
- For urgent production fixes, use `hotfix/` prefix

#### Branch Management:

- **`main`**: Production-ready code only
- **`develop`**: Integration branch for features, deployed to staging
- **`feature/*`**: Individual features (branch from `develop`)
- **`fix/*`**: Bug fixes (branch from `develop`)
- **`hotfix/*`**: Urgent production fixes (branch from `main`, merge to both `main` and `develop`)

## Key Patterns and Decisions

### Data Fetching

[TODO: Document your data fetching strategy when you implement it]

- Server Components vs Client Components
- API routes or Server Actions
- Data caching strategy

### State Management

[TODO: Document state management approach]

- Local state: useState/useReducer
- Global state: Context API / Zustand / Redux / etc.
- Server state: If using a library like React Query, SWR, etc.

### Authentication & Authorization

**Auth Provider**: NextAuth (Auth.js v5)

**Authentication Methods**:

- Email/Password (credentials provider)
- Google OAuth (social login)

**Implementation**:

- NextAuth configuration in `/app/api/auth/[...nextauth]/route.ts`
- Session management via NextAuth session strategy
- Protected routes using middleware or server-side session checks
- Single account per beauty institute (business owner)

**User Model**:

- Email (primary identifier)
- Password (hashed)
- Google account linking support
- Business/institute information tied to user account

### Database & Backend

**Database**: Supabase (hosted PostgreSQL)

- PostgreSQL database hosted on Supabase
- Supabase provides built-in auth, but we're using NextAuth instead for more flexibility
- Real-time capabilities available (optional for future features)
- Supabase dashboard for database management

**ORM**: Prisma

- Type-safe database queries with full TypeScript support
- Schema defined in `prisma/schema.prisma`
- Migrations managed via Prisma CLI
- Auto-generated types from database schema

**API Structure**:

- Prefer Server Actions for data mutations (Next.js 14+ pattern)
- API routes (`/app/api/*`) for external integrations or webhooks
- Database access through Prisma Client
- Server Components for data fetching where possible

### Styling Conventions

- Using Tailwind CSS v4 utility classes
- Custom theme tokens defined in `app/globals.css`
- [TODO: Add component styling patterns, shared components location]

### File Organization

[TODO: Document file/folder organization patterns as they emerge]

- Components: Where shared components live
- Utilities: Helper functions location
- Types: TypeScript type definitions
- Constants: Application constants

## Environment Variables

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Supabase Database
DATABASE_URL=  # PostgreSQL connection string from Supabase
DIRECT_URL=    # Direct connection URL (for Prisma migrations)

# Supabase (Optional - if using Supabase features beyond database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Known Issues & Gotchas

[TODO: Document any known issues, workarounds, or things to watch out for]

## Future Plans

[TODO: Track planned features or refactoring]
