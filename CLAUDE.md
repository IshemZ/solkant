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

- Local state: useState/useReducer for component-level state
- Global state: Context API for small apps (minimize global state when possible)
- Server state: Server Components + Server Actions (recommended for Devisio)
- For larger apps: Consider Zustand or React Query if needed

### Authentication & Authorization

**Auth Provider**: NextAuth (Auth.js v5)

**Authentication Methods**:

- Email/Password (credentials provider)
- Google OAuth (social login)

**Implementation**:

- NextAuth configuration defined in `lib/auth.ts` (providers, callbacks, session strategy)
- NextAuth API routes in `/app/api/auth/[...nextauth]/route.ts` (imports config from `lib/auth.ts`)
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
- **Current Setup**: Single Supabase project (`devisio-saas`) used for both development and production
- **Future Recommendation**: Create separate `devisio-production` project before launch for data isolation
- Supabase provides built-in auth, but we're using NextAuth instead for more flexibility
- Real-time capabilities available (optional for future features)
- Supabase dashboard for database management

**Supabase Environment Strategy**:
- **Development Phase**: One project (`devisio-saas`) shared between `main` and `develop` branches
- **Production Phase**: Two projects recommended:
  - `devisio-production` → Production database (main branch)
  - `devisio-staging` → Staging database (develop branch)
- Connection strings configured via Vercel environment variables per branch

**ORM**: Prisma v6

- Type-safe database queries with full TypeScript support
- Schema defined in `prisma/schema.prisma`
- **Currently using Prisma 6.19.0** for stability (see Known Issues for Prisma 7 problems)
- `datasource` includes `url` and `directUrl` in schema file (Prisma 6 format)
- Migrations managed via Prisma CLI (`npx prisma migrate dev`)
- Auto-generated types from database schema (`npx prisma generate`)

**API Structure**:

- Prefer Server Actions for data mutations (modern App Router pattern)
- API routes (`/app/api/*`) for external integrations or webhooks
- Database access through Prisma Client
- Server Components for data fetching where possible

**Existing API Routes**:

All API routes are in `app/api/`:

**Status**: ✅ All required API routes exist for current pages

1. **`/api/auth/[...nextauth]`** (NextAuth handler)
   - File: `app/api/auth/[...nextauth]/route.ts`
   - Methods: `GET`, `POST`
   - Purpose: Handles all NextAuth authentication requests
   - Endpoints provided:
     - `/api/auth/signin` - Sign in page
     - `/api/auth/signout` - Sign out
     - `/api/auth/callback/[provider]` - OAuth callbacks (Google)
     - `/api/auth/session` - Get current session
     - `/api/auth/csrf` - CSRF token
     - `/api/auth/providers` - List available providers
   - Configuration imported from `lib/auth.ts`

2. **`/api/auth/register`** (User registration)
   - File: `app/api/auth/register/route.ts`
   - Method: `POST`
   - Purpose: Creates new user account with email/password
   - Request body: `{ name, email, password }`
   - Validation: Email uniqueness, password length (8+ chars)
   - Security: Hashes password with bcryptjs (12 rounds)
   - Returns: User object (without password) or error
   - All error messages in French

**Existing Pages & Routes**:

All pages are in `app/`:

1. **`/`** (Homepage)
   - File: `app/page.tsx`
   - Public landing page in French
   - Features: Hero, features grid, CTA sections, footer
   - Links to `/login` and `/register`

2. **`/login`** (Login page)
   - File: `app/(auth)/login/page.tsx`
   - Component: `LoginForm.tsx`
   - Features: Email/password login, Google OAuth, all text in French
   - Redirects to `/dashboard` on success

3. **`/register`** (Registration page)
   - File: `app/(auth)/register/page.tsx`
   - Component: `RegisterForm.tsx`
   - Features: Name, email, password, confirm password, Google OAuth
   - All text in French, auto-login after registration
   - Redirects to `/dashboard` on success

4. **`/dashboard`** (Main dashboard - Protected)
   - File: `app/(dashboard)/dashboard/page.tsx`
   - Layout: `app/(dashboard)/layout.tsx` (auth protection)
   - Features: Welcome message, stats cards, quick actions, getting started guide
   - Shows user name/email from session
   - All text in French
   - Redirects to `/login` if not authenticated

### Styling Conventions

- Using Tailwind CSS v4 utility classes
- Custom theme tokens defined in `app/globals.css`
- Color scheme: Beige/brown tones for beauty industry (`#D4B5A0`, `#8B7355`)
- All UI text in French for consistency

### File Organization

**Current Project Structure:**

```
devisio/
├── app/                      # Next.js App Router
│   ├── (auth)/              # ✅ Route group for authentication
│   │   ├── login/           # ✅ Login page with email/password + Google OAuth
│   │   │   └── page.tsx     # ✅ French language login form
│   │   └── register/        # ✅ Registration page with form validation
│   │       └── page.tsx     # ✅ French language registration form
│   ├── (dashboard)/         # ✅ Protected route group for authenticated users
│   │   ├── layout.tsx       # ✅ Dashboard layout with auth protection & redirect
│   │   └── dashboard/       # ✅ Main dashboard page
│   │       └── page.tsx     # ✅ Welcome page, stats cards, quick actions, getting started guide
│   ├── api/                 # API Routes
│   │   └── auth/            # ✅ NextAuth endpoints
│   │       ├── [...nextauth]/ # ✅ NextAuth route handler (signin, signout, callback, session)
│   │       │   └── route.ts   # Imports authOptions from lib/auth.ts
│   │       └── register/    # ✅ User registration API (POST)
│   │           └── route.ts   # ✅ Creates new user with bcryptjs, all errors in French
│   ├── actions/             # Server Actions (CRUD operations - future)
│   ├── layout.tsx           # ✅ Root layout (Devisio branding, lang="fr", fonts)
│   ├── page.tsx             # ✅ Homepage (professional landing page in French)
│   └── globals.css          # ✅ Global styles (Tailwind v4 + CSS variables)
│
├── components/              # React components
│   ├── auth/                # ✅ Authentication components
│   │   ├── LoginForm.tsx    # ✅ Client component for login (French)
│   │   └── RegisterForm.tsx # ✅ Client component for registration (French)
│   ├── SignOutButton.tsx    # ✅ Client component using NextAuth signOut (French)
│   ├── ui/                  # Base UI components (future)
│   ├── quotes/              # Quote-specific components (future)
│   ├── clients/             # Client management components (future)
│   ├── services/            # Service catalog components (future)
│   └── layout/              # Layout components (future)
│
├── lib/                     # Shared utilities and configurations
│   ├── utils.ts            # ✅ Utility functions (cn for Tailwind classes)
│   ├── prisma.ts           # ✅ Prisma client singleton (Prisma 6)
│   └── auth.ts             # ✅ NextAuth configuration (Credentials + Google)
│
├── prisma/                  # Database
│   ├── schema.prisma       # ✅ Database schema (Prisma 6 format, User + Business models)
│   └── migrations/         # ✅ Migration files (initial migration applied)
│
├── types/                   # TypeScript type definitions
│   └── next-auth.d.ts      # ✅ Extended NextAuth session types
│
├── public/                  # Static assets
│
├── .env.local              # ✅ Local environment variables (git-ignored)
├── .env                    # ✅ For Prisma CLI (DATABASE_URL, DIRECT_URL)
├── .env.example            # Environment variables template
└── CLAUDE.md              # ✅ This file - comprehensive project documentation
```

**Status Legend:**
- ✅ = Completed and functional
- (no icon) = Placeholder directory or planned feature

**File Naming Conventions:**

- Server Actions: `app/actions/{entity}.ts` (e.g., `quotes.ts`, `clients.ts`)
- Components: PascalCase (e.g., `QuoteCard.tsx`, `ClientList.tsx`)
- Utilities: camelCase (e.g., `utils.ts`, `formatters.ts`)
- Types: `types.ts` or inline with components
- Constants: `constants.ts` with UPPER_CASE exports
- Tests: Co-located with components (e.g., `QuoteCard.test.tsx` next to `QuoteCard.tsx`)

## Environment Variables

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Supabase Database
# Get these from Supabase Dashboard → Project Settings → Database
# Connection string section with two modes:
DATABASE_URL=   # Transaction mode (port 6543) - for app queries with connection pooling
DIRECT_URL=     # Session mode (port 5432) - for Prisma migrations (direct connection)

# Supabase (Optional - if using Supabase features beyond database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Development Best Practices

Follow these modern SaaS development practices when working on Devisio:

### Code Quality

- **TypeScript Strict Mode**: Always maintain strict type checking
- **ESLint**: Fix linting issues before committing (`npm run lint`)
- **Code Reviews**: Use PRs for all changes, even solo development
- **Small Commits**: Make atomic commits with clear, descriptive messages
- **No Console Logs**: Remove `console.log` in production code (use proper logging)

### Architecture Patterns

- **Server-First**: Prefer Server Components over Client Components
  - Only use `"use client"` when absolutely necessary (interactivity, browser APIs)
  - Keep business logic on the server for security and performance
- **Server Actions**: Use Server Actions for mutations instead of API routes
  - Automatic revalidation and optimistic updates
  - Type-safe data mutations
- **Colocation**: Keep related files close (component + styles + tests in same folder)
  - Example: `components/quotes/QuoteCard.tsx` with `QuoteCard.test.tsx` in same folder
  - Group domain-specific components together (`components/quotes/`, `components/clients/`)
- **Composition over Inheritance**: Build small, reusable components

### Security Best Practices

- **Environment Variables**:
  - Use `.env.local` for actual secrets (ignored by git)
  - `.env.example` is the template (safe to commit, no real values)
  - Never commit `.env` files with real credentials
- **Input Validation**: Always validate user input with Zod schemas
- **SQL Injection**: Use Prisma parameterized queries (never raw SQL with user input)
- **XSS Protection**: React escapes by default, but be careful with `dangerouslySetInnerHTML`
- **CSRF Protection**: NextAuth handles CSRF tokens automatically
- **Rate Limiting**: Implement rate limiting on API routes and Server Actions
- **Authentication**: Always check user session on sensitive operations

### Performance Optimization

- **Image Optimization**: Use Next.js `<Image>` component for all images
- **Font Optimization**: Already using `next/font` for Geist fonts
- **Code Splitting**: Use dynamic imports for heavy components
- **Database Queries**:
  - Use Prisma's `select` to fetch only needed fields
  - Implement pagination for large datasets
  - Use database indexes on frequently queried fields
- **Caching**: Leverage Next.js caching strategies
  - Static pages where possible
  - ISR (Incremental Static Regeneration) for semi-dynamic content
  - Client-side caching for user data

### Database Best Practices

- **Migrations**: Always use Prisma migrations (never edit database directly)
- **Relations**: Define relationships in Prisma schema for type safety
- **Soft Deletes**: Consider soft deletes for important data (quotes, clients)
- **Timestamps**: Include `createdAt` and `updatedAt` on all models
- **Unique Constraints**: Use database constraints for data integrity
- **Transactions**: Use Prisma transactions for multi-step operations

### State Management

- **Server State**: Fetch data on the server when possible
- **URL State**: Use URL params for shareable state (filters, pagination)
- **Form State**: Use React Hook Form or similar for complex forms
- **Global State**: Minimize global state, prefer prop drilling or context for small apps
- **Optimistic Updates**: Use Server Actions with optimistic UI for better UX

### Testing Strategy

- **Unit Tests**: Test utility functions and business logic
- **Integration Tests**: Test Server Actions and API routes
- **E2E Tests**: Test critical user flows (quote creation, client management)
- **Type Safety**: Let TypeScript catch errors at compile time
- **Manual Testing**: Always test on staging before production

### Deployment & CI/CD

- **Branch Protection**: Main branch should be protected
- **Preview Deployments**: Test all features on Vercel preview URLs
- **Environment Parity**: Keep staging and production environments similar
- **Database Migrations**: Run migrations before deploying new code
- **Rollback Plan**: Keep previous deployment accessible for quick rollback
- **Monitoring**: Set up error tracking (Sentry) and analytics

### Accessibility (a11y)

- **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, etc.)
- **ARIA Labels**: Add labels for screen readers where needed
- **Keyboard Navigation**: Ensure all interactive elements are keyboard-accessible
- **Color Contrast**: Maintain WCAG AA contrast ratios
- **Focus Indicators**: Never remove focus outlines without replacing them

### Code Organization Tips

- **Barrel Exports**: Use index.ts for clean imports
  ```typescript
  // components/ui/index.ts
  export { Button } from './Button'
  export { Input } from './Input'
  ```
- **Absolute Imports**: Use `@/` alias for cleaner imports
- **Shared Types**: Define shared types in a central location
- **Constants**: Extract magic numbers/strings to constants
- **Error Handling**: Use try-catch with meaningful error messages

### SaaS-Specific Patterns

- **Multi-Tenancy**: Each business has isolated data (enforced by Prisma queries)
- **Feature Flags**: Consider feature flags for gradual rollouts
- **Audit Logs**: Track important actions (quote sent, client deleted)
- **User Feedback**: Implement feedback mechanism for user suggestions
- **Onboarding**: Create smooth onboarding flow for new users
- **Data Export**: Allow users to export their data (GDPR compliance)

### Dependencies Management

- **Keep Updated**: Regularly update dependencies (`npm outdated`)
- **Security Audits**: Run `npm audit` regularly
- **Bundle Size**: Monitor bundle size (use `@next/bundle-analyzer`)
- **Tree Shaking**: Import only what you need from libraries
- **Peer Dependencies**: Check compatibility before adding new packages

### Documentation

- **Code Comments**: Comment "why", not "what"
- **JSDoc**: Use JSDoc for public API functions
- **README**: Keep README updated with setup instructions
- **CLAUDE.md**: Update this file when making architectural decisions
- **Inline TODOs**: Use `// TODO:` for technical debt (track in issues)

## Known Issues & Gotchas

### Prisma Version Compatibility

**Issue**: Prisma 7 introduced breaking changes to datasource configuration that cause migration failures.

**Symptoms**:
- `Error: The datasource property 'url' is no longer supported in schema files`
- Migration commands fail with config file errors
- `prisma.config.ts` or `prisma.config.js` parsing errors

**Solution**: Use Prisma 6 instead of Prisma 7
```bash
npm install prisma@6 @prisma/client@6
```

**Current Setup**:
- Using **Prisma 6.19.0** for stability
- Schema file includes `url` and `directUrl` in datasource block (Prisma 6 format)
- Prisma CLI reads from `.env` file (not `.env.local`)
- Migrations work reliably with this version

**Workaround for .env.local**:
Prisma CLI only reads `.env` files by default. To use variables from `.env.local`:
```bash
# Copy database URLs from .env.local to .env
cat .env.local | grep -E "^(DATABASE_URL|DIRECT_URL)=" > .env
```

**When to revisit**: Monitor Prisma 7 stable releases and migration documentation updates.

### Environment Variables for Prisma

**Issue**: Next.js loads `.env.local` but Prisma CLI only loads `.env`

**Workaround**:
- Keep a `.env` file with `DATABASE_URL` and `DIRECT_URL` for Prisma CLI
- Keep `.env.local` for Next.js app runtime (includes all secrets)
- Both files are git-ignored for security

**Note**: This is expected behavior, not a bug. The two tools have different env loading strategies.

## UX Review & Recommendations

**Last Review Date**: 2025-11-30
**Overall UX Score**: 7.5/10 *(improved from 6.5)*

This section documents UX issues identified during development and prioritized recommendations for improvement. It serves as a roadmap for UX enhancements.

### UX Score Breakdown

| Category | Score | Notes |
|----------|-------|-------|
| **Visual Design** | 7.5/10 | Clean, professional, good color palette |
| **Navigation** | 7/10 | ✅ Dashboard route created, no mobile menu |
| **User Feedback** | 5/10 | Loading states added, needs toast notifications |
| **Accessibility** | 6/10 | Missing some focus states, ARIA labels |
| **Language Consistency** | 10/10 | ✅ **Fixed**: All pages in French |
| **Forms & Authentication** | 7/10 | ✅ Proper signout, missing password visibility toggle |
| **Responsiveness** | 7/10 | Good mobile design, needs mobile nav |
| **Error Handling** | 6/10 | French error messages, needs improvement |

### Critical Issues - COMPLETED ✅

These critical issues have been resolved:

1. ✅ **Language Inconsistency** - FIXED
   - **Was**: Homepage in French, auth pages in English
   - **Fixed**: All pages uniformized to French (login, register, dashboard, API errors)
   - **Commit**: "Uniformize language to French across all auth pages"
   - **Files fixed**:
     - [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx)
     - [app/(auth)/register/page.tsx](app/(auth)/register/page.tsx)
     - [components/auth/LoginForm.tsx](components/auth/LoginForm.tsx)
     - [components/auth/RegisterForm.tsx](components/auth/RegisterForm.tsx)
     - [app/api/auth/register/route.ts](app/api/auth/register/route.ts)

2. ✅ **Missing Dashboard Route** - FIXED
   - **Was**: 404 error after successful login/registration
   - **Fixed**: Created complete dashboard with welcome message, stats cards, quick actions, getting started guide
   - **File created**: [app/(dashboard)/dashboard/page.tsx](app/(dashboard)/dashboard/page.tsx)

3. ✅ **Improper Sign Out Implementation** - FIXED
   - **Was**: Anchor tag with href="/api/auth/signout" (no CSRF protection)
   - **Fixed**: Created SignOutButton client component using NextAuth's signOut()
   - **File created**: [components/SignOutButton.tsx](components/SignOutButton.tsx)
   - **Security**: Proper CSRF protection, redirects to homepage

4. ✅ **Root Layout Metadata** - FIXED
   - **Was**: Default "Create Next App" metadata, HTML lang="en"
   - **Fixed**: Proper Devisio branding, HTML lang="fr" for accessibility
   - **File fixed**: [app/layout.tsx](app/layout.tsx)

### Remaining Critical Issues

5. **No User Feedback** ⚠️
   - **Problem**: No success messages or confirmations
   - **Impact**: Users don't know if actions succeeded
   - **Fix**:
     - Add toast notifications library (react-hot-toast or sonner)
     - Show "Registration successful!" message
     - Add success feedback after form submissions

6. **Generic Error Messages** ⚠️
   - **Problem**: "Invalid email or password" doesn't help debug
   - **Impact**: Poor user experience, support burden
   - **Fix**:
     - Distinguish between "User not found" and "Wrong password"
     - Add field-specific validation errors
     - Show helpful hints ("Email format incorrect")

### Important Improvements (Phase 2)

These significantly improve UX but aren't blocking:

5. **Missing Forgot Password Flow**
   - Add "Forgot password?" link
   - Implement password reset via email
   - Create reset token system in Prisma schema

6. **No Password Visibility Toggle**
   - Add eye icon to show/hide password
   - Common UX pattern users expect
   - Easy accessibility win

7. **No Mobile Navigation Menu**
   - Homepage nav doesn't adapt for mobile
   - Add hamburger menu for small screens
   - Ensure touch-friendly buttons

8. **Theme Not Applied to Forms**
   - Forms use generic styling
   - Should match homepage color palette
   - Apply primary/secondary colors from Prisma Business model

9. **No Loading States**
   - Forms submit without visual feedback
   - Add spinners or skeleton screens
   - Disable buttons during submission

10. **Accessibility Gaps**
    - Missing focus indicators on interactive elements
    - No ARIA labels for screen readers
    - Forms missing proper label associations

### Nice-to-Have Enhancements (Phase 3)

These polish the experience but can wait:

11. **No Social Proof**
    - Homepage lacks testimonials, reviews, or client logos
    - Add social proof section for credibility

12. **No Pricing Information**
    - Users can't see pricing before signing up
    - Consider adding pricing page or transparency

13. **Missing Demo/Screenshots**
    - Landing page doesn't show product
    - Add dashboard preview screenshots

14. **No Onboarding Flow**
    - After registration, users dropped into empty dashboard
    - Add guided tour or setup wizard

15. **Animations Missing**
    - Static experience, no micro-interactions
    - Add subtle transitions for polish

### Prioritized Implementation Roadmap

#### **Phase 1: Critical Fixes** - PARTIALLY COMPLETED ✅

**Completed**:

1. ✅ Uniformize language to French (all auth pages)
2. ✅ Create `/dashboard` route with basic layout
3. ✅ Fix root layout metadata and HTML lang attribute
4. ✅ Implement proper SignOut with NextAuth
5. ✅ Add loading states to auth forms

**Remaining**:

1. ⏳ Add toast notification system
2. ⏳ Implement success/error feedback messages
3. ⏳ Improve error messages with specific guidance

**Estimated effort for remaining**: 0.5-1 day

**Impact**: Core user flows functional, app is usable for testing

#### **Phase 2: Important UX (Before Beta)**
Complete before inviting real users:

1. Implement forgot password flow
2. Add password visibility toggle
3. Create responsive mobile navigation
4. Apply theme colors to auth pages
5. Add proper focus states and ARIA labels
6. Improve form validation feedback

**Estimated effort**: 2-3 days
**Impact**: Professional, polished experience

#### **Phase 3: Polish & Growth (Post-Launch)**
Add after core product is stable:

1. Add social proof section
2. Create pricing/features comparison page
3. Add product screenshots to homepage
4. Build onboarding wizard for new users
5. Add micro-animations and transitions
6. Implement analytics and user feedback system

**Estimated effort**: 3-5 days
**Impact**: Increased conversions, better retention

### UX Testing Recommendations

Before launching to users:

- [ ] Test complete auth flow (register → login → dashboard)
- [ ] Verify all text is in French
- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test keyboard navigation (tab through forms)
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] Verify error states display correctly
- [ ] Test Google OAuth flow end-to-end
- [ ] Check all links work (no 404s)

### Design System Consistency

**Current Theme** (from Prisma Business model):
- Primary: `#D4B5A0` (beige - beauty industry aesthetic)
- Secondary: `#8B7355` (darker beige/brown)

**To Apply**:
- Use primary color for CTAs and highlights
- Use secondary for hover states and accents
- Ensure auth pages match homepage aesthetic
- Create reusable button/input components with theme

### Future UX Considerations

As the product grows, consider:

- **Multi-language support**: If expanding beyond French market
- **Dark mode**: Optional, but increasingly expected
- **Keyboard shortcuts**: Power user feature for quote creation
- **Bulk actions**: For managing multiple clients/quotes
- **Search functionality**: When data volume grows
- **Export options**: PDF, CSV for quotes and reports
- **Email templates**: Professional quote delivery
- **Client portal**: Let clients view/accept quotes online

## Development Roadmap & Todo List

This section provides a prioritized list of tasks to complete before launch. Items are organized by priority and estimated effort.

### 🔴 **Critical Priority - Do Immediately**

These items are **blocking** for production launch and pose security/data integrity risks:

#### **1. Multi-Tenancy Data Isolation** 🔴 CRITICAL
**Priority**: Highest
**Effort**: 2-3 hours
**Risk**: Data leak between businesses

- [ ] Create multi-tenancy helper functions in `lib/multi-tenancy.ts`:
  ```typescript
  export async function getUserBusinessId(userId: string): Promise<string>
  export function withBusinessFilter<T>(businessId: string, query: T): T
  ```
- [ ] Add Prisma middleware to enforce businessId filtering on all queries
- [ ] Audit all existing queries to ensure they filter by businessId
- [ ] Add businessId to NextAuth session object
- [ ] Update `types/next-auth.d.ts` to include businessId in session

**Files to create/modify**:
- Create: `lib/multi-tenancy.ts`
- Modify: `lib/auth.ts` (add businessId to session callback)
- Modify: `types/next-auth.d.ts`

---

#### **2. Automatic Business Creation on Registration** 🔴 CRITICAL
**Priority**: Highest
**Effort**: 1-2 hours
**Risk**: Users can't use the app without a Business record

- [ ] Modify registration flow to create Business + User in single transaction
- [ ] Update `app/api/auth/register/route.ts`:
  ```typescript
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name, email, password }})
    const business = await tx.business.create({
      data: {
        name: `Institut de ${name}`,
        userId: user.id
      }
    })
    return { user, business }
  })
  ```
- [ ] Handle Google OAuth registration (add callback in `lib/auth.ts`)
- [ ] Test registration flow creates both User and Business

**Files to modify**:
- `app/api/auth/register/route.ts`
- `lib/auth.ts` (signIn callback for OAuth)

---

#### **3. Input Validation with Zod Schemas** 🔴 CRITICAL
**Priority**: High
**Effort**: 2-3 hours
**Risk**: SQL injection, XSS, invalid data in database

- [ ] Create validation schemas in `lib/validations/`:
  - [ ] `auth.ts` - registration, login schemas
  - [ ] `business.ts` - business profile schemas
  - [ ] `client.ts` - client CRUD schemas
  - [ ] `service.ts` - service CRUD schemas
  - [ ] `quote.ts` - quote creation schemas
- [ ] Apply validation in API routes and Server Actions
- [ ] Add input sanitization (trim, lowercase email)
- [ ] Validate on both client and server

**Example schema**:
```typescript
// lib/validations/auth.ts
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

**Files to create**:
- `lib/validations/auth.ts`
- `lib/validations/business.ts`
- `lib/validations/client.ts`
- `lib/validations/service.ts`
- `lib/validations/quote.ts`

---

#### **4. Create .env.example File** 🔴 CRITICAL
**Priority**: High
**Effort**: 15 minutes
**Risk**: Other developers/deployments missing required env vars

- [ ] Create `.env.example` with all required variables (placeholder values)
- [ ] Document each variable's purpose
- [ ] Add instructions for obtaining values (Google OAuth, Supabase URLs)

**File to create**:
```bash
# .env.example

# Database (Supabase PostgreSQL)
# Get from: Supabase Dashboard → Project Settings → Database → Connection String
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
# Get from: Google Cloud Console → APIs & Services → Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

### 🟠 **High Priority - Before Beta Launch**

These improve security, reliability, and production-readiness:

#### **5. Rate Limiting on Auth Endpoints** 🟠
**Priority**: High
**Effort**: 2-3 hours
**Risk**: Brute force attacks, DoS

- [ ] Install rate limiting library: `npm install @upstash/ratelimit @upstash/redis`
- [ ] Create Upstash Redis account (free tier)
- [ ] Add rate limiter in `lib/rate-limit.ts`
- [ ] Apply to login and registration endpoints (5 attempts per 15 minutes)
- [ ] Return proper error messages in French

**Files to create/modify**:
- Create: `lib/rate-limit.ts`
- Modify: `app/api/auth/register/route.ts`
- Modify: `components/auth/LoginForm.tsx`

---

#### **6. Implement Server Actions for Data Mutations** 🟠
**Priority**: High
**Effort**: 4-5 hours
**Benefits**: Better type safety, automatic revalidation, optimistic updates

- [ ] Create Server Actions in `app/actions/`:
  - [ ] `auth.ts` - registration action (replace API route)
  - [ ] `business.ts` - update business profile
  - [ ] `clients.ts` - CRUD operations
  - [ ] `services.ts` - CRUD operations
  - [ ] `quotes.ts` - CRUD operations
- [ ] Use `revalidatePath()` for cache invalidation
- [ ] Add proper error handling and return types
- [ ] Replace API route usage in components with Server Actions

**Example Server Action**:
```typescript
// app/actions/clients.ts
'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { createClientSchema } from '@/lib/validations/client'

export async function createClient(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.businessId) {
    return { error: 'Non autorisé' }
  }

  const validated = createClientSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const client = await prisma.client.create({
    data: {
      ...validated.data,
      businessId: session.user.businessId,
    }
  })

  revalidatePath('/dashboard/clients')
  return { success: true, client }
}
```

---

#### **7. Proper Error Handling & Logging** 🟠
**Priority**: High
**Effort**: 2-3 hours

- [ ] Create logging utility in `lib/logger.ts`:
  - Console logs in development
  - Sentry/LogTail in production (install later)
  - Structured error logging
- [ ] Replace all `console.error()` with logger
- [ ] Add error boundaries:
  - [ ] `app/error.tsx` (global error boundary)
  - [ ] `app/(dashboard)/error.tsx` (dashboard error boundary)
- [ ] Add loading states:
  - [ ] `app/(dashboard)/loading.tsx`
  - [ ] `app/(dashboard)/clients/loading.tsx`
  - [ ] `app/(dashboard)/quotes/loading.tsx`

**Files to create**:
- `lib/logger.ts`
- `app/error.tsx`
- `app/(dashboard)/error.tsx`
- `app/(dashboard)/loading.tsx`

---

#### **8. Environment Variable Type Safety** 🟠
**Priority**: Medium
**Effort**: 1 hour

- [ ] Create `lib/env.ts` with Zod validation:
  ```typescript
  import { z } from 'zod'

  const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  })

  export const env = envSchema.parse(process.env)
  ```
- [ ] Replace `process.env.X` with `env.X` throughout codebase
- [ ] Build will fail if env vars are missing/invalid

**File to create**:
- `lib/env.ts`

---

### 🟡 **Medium Priority - Post-Beta, Pre-Launch**

Improves code quality and developer experience:

#### **9. Component Barrel Exports** 🟡
**Priority**: Medium
**Effort**: 30 minutes

- [ ] Create `components/auth/index.ts`:
  ```typescript
  export { default as LoginForm } from './LoginForm'
  export { default as RegisterForm } from './RegisterForm'
  ```
- [ ] Update imports to use barrel exports
- [ ] Create barrel exports for other component folders as they grow

---

#### **10. Database Query Optimization** 🟡
**Priority**: Medium
**Effort**: 1-2 hours

- [ ] Add `select` to only fetch needed fields
- [ ] Use `include` for relationships instead of separate queries
- [ ] Add database indexes on frequently queried fields:
  - [ ] `Client.email` (if searching by email)
  - [ ] `Quote.quoteNumber`
  - [ ] `Quote.status`
- [ ] Use pagination for large datasets:
  ```typescript
  const clients = await prisma.client.findMany({
    where: { businessId },
    take: 20,
    skip: page * 20,
    orderBy: { createdAt: 'desc' },
  })
  ```

---

#### **11. Toast Notification System** 🟡
**Priority**: Medium (UX improvement)
**Effort**: 1-2 hours

- [ ] Install: `npm install sonner` (recommended) or `react-hot-toast`
- [ ] Add Toaster to root layout
- [ ] Show success messages:
  - "Inscription réussie!"
  - "Client créé avec succès"
  - "Devis envoyé"
- [ ] Show error messages with helpful text

**Files to modify**:
- `app/layout.tsx` (add Toaster)
- All forms (add toast.success/error)

---

### 🟢 **Low Priority - Nice to Have**

Polish and quality of life improvements:

#### **12. Improved Error Messages** 🟢
**Priority**: Low (UX improvement)
**Effort**: 2-3 hours

- [ ] Distinguish "user not found" vs "wrong password"
- [ ] Add field-specific validation errors
- [ ] Show helpful hints for common mistakes

---

#### **13. Add Testing** 🟢
**Priority**: Low (for now)
**Effort**: Ongoing

- [ ] Install testing libraries: `npm install -D vitest @testing-library/react`
- [ ] Unit tests for utility functions
- [ ] Integration tests for Server Actions
- [ ] E2E tests for critical flows (Playwright)

---

#### **14. Performance Monitoring** 🟢
**Priority**: Low
**Effort**: 2-3 hours

- [ ] Install Sentry for error tracking
- [ ] Set up Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Add performance budgets

---

### 📊 **Progress Tracking**

| Priority | Total Tasks | Completed | Remaining |
|----------|-------------|-----------|-----------|
| 🔴 Critical | 4 | 0 | 4 |
| 🟠 High | 4 | 0 | 4 |
| 🟡 Medium | 3 | 0 | 3 |
| 🟢 Low | 4 | 0 | 4 |
| **TOTAL** | **15** | **0** | **15** |

**Estimated Time to Production-Ready**: 20-25 hours of development

---

### ✅ **Completion Criteria**

Before deploying to production, ensure:

- [x] All 🔴 Critical tasks completed
- [x] All 🟠 High priority tasks completed
- [ ] At least 50% of 🟡 Medium priority tasks completed
- [ ] Full manual testing on staging environment
- [ ] Security audit completed
- [ ] Performance testing passed
- [ ] Backup and rollback plan in place

---

## Future Plans

**Post-Launch Features** (not in current roadmap):

- Email notifications for quote sent/accepted
- PDF generation for quotes
- Client portal for viewing/accepting quotes
- Analytics dashboard
- Mobile app (React Native)
- Multi-language support (if expanding beyond France)
- Dark mode
- Advanced reporting and exports

## Initial Setup Checklist

This checklist guides the initial project setup. Check off items as they are completed.

### 1. Project Structure

- [ ] Create `lib/` directory for shared utilities
  - [ ] `lib/prisma.ts` - Prisma client singleton
  - [ ] `lib/auth.ts` - NextAuth configuration
  - [ ] `lib/utils.ts` - Utility functions (cn, formatters, etc.)
- [ ] Create `components/` directory structure
  - [ ] `components/ui/` - Base UI components
  - [ ] `components/quotes/` - Quote-specific components
  - [ ] `components/clients/` - Client management components
  - [ ] `components/services/` - Service management components
  - [ ] `components/layout/` - Layout components (Header, Sidebar, Footer)
- [ ] Create `app/actions/` directory for Server Actions
  - [ ] `app/actions/quotes.ts` - Quote CRUD operations
  - [ ] `app/actions/clients.ts` - Client CRUD operations
  - [ ] `app/actions/services.ts` - Service CRUD operations
- [ ] Create route groups in `app/`
  - [ ] `app/(auth)/` - Authentication pages
  - [ ] `app/(dashboard)/` - Protected dashboard routes
- [ ] Create `prisma/` directory for database schema

### 2. Dependencies Installation

- [ ] Install Prisma
  ```bash
  npm install @prisma/client
  npm install -D prisma
  ```
- [ ] Install NextAuth
  ```bash
  npm install next-auth
  ```
- [ ] Install validation library
  ```bash
  npm install zod
  ```
- [ ] Install Tailwind utilities
  ```bash
  npm install clsx tailwind-merge
  ```
- [ ] Install UI components library (optional - shadcn/ui)
  ```bash
  npx shadcn@latest init
  ```

### 3. Database Setup (Supabase + Prisma)

- [ ] Create Supabase project at https://supabase.com
  - [ ] Project name: `devisio-saas` (or your preferred name)
  - [ ] Choose region closest to your users
  - [ ] Set and save database password securely
  - [ ] Go to **Project Settings** → **Database**
  - [ ] Copy **Connection string** in **URI** format:
    - **Transaction mode** (port 6543) → `DATABASE_URL`
    - **Session mode** (port 5432) → `DIRECT_URL`
  - [ ] Replace `[YOUR-PASSWORD]` with your actual database password in both URLs
- [ ] Initialize Prisma
  ```bash
  npx prisma init
  ```
- [ ] Configure Prisma schema (`prisma/schema.prisma`)
  - [ ] Set up PostgreSQL datasource
  - [ ] Define User model
  - [ ] Define Business model
  - [ ] Define Client model
  - [ ] Define Service model
  - [ ] Define Quote model
  - [ ] Define QuoteItem model
- [ ] Create initial migration
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Generate Prisma client
  ```bash
  npx prisma generate
  ```

### 4. Environment Variables Setup

- [ ] Create `.env.local` file (copy from `.env.example`)
- [ ] Configure local environment variables
  - [ ] `DATABASE_URL` - Supabase connection pooling URL
  - [ ] `DIRECT_URL` - Supabase direct connection URL
  - [ ] `NEXTAUTH_URL` - http://localhost:3000
  - [ ] `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- [ ] Configure Vercel environment variables
  - [ ] Production environment variables
  - [ ] Preview environment variables

### 5. NextAuth Configuration

- [ ] Create Google OAuth credentials
  - [ ] Go to Google Cloud Console
  - [ ] Create OAuth 2.0 Client ID
  - [ ] Add authorized redirect URIs
  - [ ] Note down Client ID and Secret
- [ ] Create NextAuth configuration in `lib/auth.ts`
  - [ ] Configure providers (Credentials, Google)
  - [ ] Configure session strategy
  - [ ] Configure callbacks (jwt, session)
- [ ] Create NextAuth API route `app/api/auth/[...nextauth]/route.ts`
  - [ ] Import auth config from `lib/auth.ts`
  - [ ] Export GET and POST handlers
- [ ] Test authentication flow

### 6. Initial UI Setup

- [ ] Set up base layout
  - [ ] Update `app/layout.tsx` with proper metadata
  - [ ] Configure fonts and theme
- [ ] Create authentication pages
  - [ ] `app/(auth)/login/page.tsx`
  - [ ] `app/(auth)/register/page.tsx`
- [ ] Create dashboard layout
  - [ ] `app/(dashboard)/layout.tsx` with navigation
- [ ] Create placeholder dashboard pages
  - [ ] `app/(dashboard)/quotes/page.tsx`
  - [ ] `app/(dashboard)/clients/page.tsx`
  - [ ] `app/(dashboard)/services/page.tsx`

### 7. Testing & Verification

- [ ] Test local development server
  ```bash
  npm run dev
  ```
- [ ] Verify database connection
- [ ] Test authentication flow (login/logout)
- [ ] Run linting
  ```bash
  npm run lint
  ```
- [ ] Build production bundle
  ```bash
  npm run build
  ```
- [ ] Deploy to Vercel and test preview URL

### 8. Documentation

- [ ] Update CLAUDE.md with actual file structure
- [ ] Document any architectural decisions made
- [ ] Update environment variables section if needed
- [ ] Add any gotchas or important notes discovered during setup
