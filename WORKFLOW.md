# Workflow Documentation for Devisio

This document outlines the full development and deployment workflow for the **Devisio** project, a SaaS platform for beauty institutes.

---

## 1. Branch Naming Conventions

Follow the naming conventions below for consistent version control:

- `feature/*` – New features or enhancements
- `fix/*` – Bug fixes
- `hotfix/*` – Urgent production issues
- `release/*` – Pre-release preparation

---

## 2. Git Workflow

### 🔧 For New Features

1. **Start from **``:

   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Develop and test locally**:

   ```bash
   npm run dev      # Run dev server
   npm run lint     # Check code quality
   ```

4. **Commit and push**:

   ```bash
   git add .
   git commit -m "Add: your-feature-name"
   git push origin feature/your-feature-name
   ```

5. **Test Preview on Vercel** (auto-deployed)

6. **Merge into **``:

   ```bash
   git checkout develop
   git merge feature/your-feature-name
   git push origin develop
   ```

7. **Deploy to production when stable**:

   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

---

### 🐞 For Bug Fixes

- Create from `develop`: `fix/bug-description`
- Follow same steps as feature branches

---

### 🔥 For Hotfixes (Production)

- Create from `main`: `hotfix/critical-bug`
- After fixing, merge into both `main` and `develop`

---

## 3. Deployment Strategy

- **Platform**: [Vercel](https://vercel.com)
- **Environments**:
  - `main` → Production (auto-deploy)
  - `develop` → Staging
  - Feature branches → Preview URLs

### Deployment Flow:

| Branch     | Environment | URL Type          |
| ---------- | ----------- | ----------------- |
| `main`     | Production  | Live domain       |
| `develop`  | Staging     | Staging domain    |
| feature/\* | Preview     | Temporary preview |

---

## 4. Development Guidelines

### ✅ Do:

- Use PRs for every change (even solo devs)
- Commit frequently with clear messages
- Run lint and test before pushing
- Use French for all UI text

### 🚫 Don’t:

- Push directly to `main`
- Leave console logs in production
- Mix unrelated changes in one PR

---

## 5. Pre-Production Checklist

-

---

## 6. Post-Deployment

- Monitor Vercel dashboard
- Review error logs (e.g. Sentry if integrated)
- Announce release in project channel
- Track feedback and start next sprint

---

## 7. CI/CD & Automation

- **Linting**: `npm run lint`
- **Type Checking**: Enabled via TS strict mode
- **Preview Deploys**: Automatic via Vercel
- **Migrations**: Run with Prisma before deploy

---

## 8. Documentation

- Update `CLAUDE.md` and related markdown files when architecture, workflow or stack changes.
- Add `TODO:` or inline comments where refactoring is needed.

---

*Last updated: 2025-12-01*

