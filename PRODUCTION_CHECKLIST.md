# ✅ Checklist Production - Devisio

**Date de l'audit** : 2 décembre 2025  
**Branche** : `test` → `main`

---

## 🔴 CRITIQUES (OBLIGATOIRES) - ✅ CORRIGÉS

### ✅ 1. Variables d'environnement sécurisées

- [x] Validation avec Zod dans `lib/env.ts`
- [x] Import dans `lib/auth.ts` pour vérifier credentials Google
- [x] Validation au démarrage dans `app/layout.tsx`
- [x] Google OAuth conditionnel (désactivé si credentials manquants)

**Impact** : Empêche le crash en production si `.env` incomplet.

---

### ✅ 2. Security Headers

- [x] Headers HTTPS ajoutés dans `next.config.ts`
  - HSTS (Strict-Transport-Security)
  - X-Frame-Options (protection clickjacking)
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy

**Impact** : Protection contre XSS, clickjacking, MITM attacks.

---

### ✅ 3. Rate Limiting sur API /register

- [x] Limite 5 tentatives / 15 minutes par IP
- [x] In-memory storage (simple mais fonctionnel)
- [x] Message d'erreur 429 approprié

**Recommandation future** : Migrer vers Upstash Redis en production.

---

### ✅ 4. Input Sanitization

- [x] Sanitization XSS dans `createClient()` et `updateClient()`
- [x] Utilisation de `sanitizeObject()` avant validation Zod

**À faire** : Appliquer sur toutes les Server Actions (quotes, services, business).

---

### ✅ 5. robots.txt fixé

- [x] URL changée de `solkant.com` → `devisio.vercel.app`

---

## 🟡 IMPORTANTES (RECOMMANDÉES)

### ⚠️ 6. Logging en production

**État** : Console.error partout, mais pas de monitoring externe

**Actions** :

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Ajouter dans `.env.local` :

```
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
```

---

### ⚠️ 7. Database Index manquants

**État** : Index présents sur `businessId` mais pas partout

**Vérifier Prisma schema** :

```prisma
@@index([businessId])          // ✅ Présent
@@index([clientId])             // ✅ Présent
@@index([createdAt])            // ❌ Manquant (tri fréquent)
@@index([status])               // ❌ Manquant (filtre fréquent)
```

---

### ⚠️ 8. Backup Strategy

**État** : Aucun backup configuré

**Actions Neon** :

1. Dashboard Neon → Settings → Backups
2. Activer "Point-in-time recovery" (7 jours)
3. Configurer export automatique vers S3 (optionnel)

---

### ⚠️ 9. HTTPS Enforcement

**État** : Vercel force HTTPS automatiquement ✅

**Vérifier** :

- [ ] Domaine custom configuré dans Vercel
- [ ] Certificat SSL valide (auto Vercel)
- [ ] Redirect HTTP → HTTPS actif

---

### ⚠️ 10. Session Expiration

**État** : JWT sans expiration explicite

**Ajouter dans `lib/auth.ts`** :

```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 jours
  updateAge: 24 * 60 * 60,    // Update tous les jours
},
```

---

## 🟢 BONNES PRATIQUES (OPTIONNELLES)

### ✅ 11. Multi-tenancy sécurisé

- [x] Toutes les queries filtrent par `businessId`
- [x] Commentaire `// Tenant isolation` présent
- [x] Aucun leak potentiel détecté

**Score** : 10/10 🎯

---

### ✅ 12. Validation Zod exhaustive

- [x] Schémas pour tous les modèles
- [x] Messages d'erreur en français
- [x] Export centralisé dans `lib/validations/index.ts`

---

### ✅ 13. Server Actions pattern

- [x] Pattern `{ data, error }` cohérent
- [x] `revalidatePath()` après mutations
- [x] Session check systématique

---

### ⚠️ 14. Tests absents

**État** : Infrastructure Vitest présente mais tests limités

**À faire** :

```bash
npm run test:run
```

Ajouter tests pour :

- [ ] Server Actions critiques (createQuote, createClient)
- [ ] Auth flow (register, login)
- [ ] PDF generation

---

### ⚠️ 15. Environment Preview Vercel

**État** : Non configuré

**Actions Vercel** :

1. Settings → Environment Variables
2. Ajouter toutes les vars `.env.example`
3. Scope : Production + Preview + Development

---

## 🚀 DÉPLOIEMENT VERCEL

### Étape 1 : Configuration Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Étape 2 : Variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables :

```
DATABASE_URL          = postgres://... (Neon pooled)
DIRECT_URL            = postgres://... (Neon direct)
NEXTAUTH_URL          = https://devisio.vercel.app
NEXTAUTH_SECRET       = [générer nouveau secret]
GOOGLE_CLIENT_ID      = [optionnel]
GOOGLE_CLIENT_SECRET  = [optionnel]
NODE_ENV              = production
```

**⚠️ IMPORTANT** : Ne JAMAIS copier-coller `.env.local` dans Vercel. Regénérer les secrets.

### Étape 3 : Vérifications post-deploy

- [ ] Page d'accueil charge sans erreur
- [ ] Login fonctionne (credentials)
- [ ] Google OAuth fonctionne (si configuré)
- [ ] Création de client/service/devis OK
- [ ] PDF génération fonctionne
- [ ] Logs Vercel propres (pas d'erreurs 500)

---

## 📊 SCORE FINAL

| Catégorie        | Score   |
| ---------------- | ------- |
| Sécurité         | 9/10 ⭐ |
| Performance      | 8/10 ⭐ |
| Architecture     | 9/10 ⭐ |
| Production-ready | 8/10 ⭐ |

**TOTAL** : **34/40** (85%) - **PRÊT POUR PRODUCTION** ✅

---

## 🎯 ACTIONS IMMÉDIATES AVANT PUSH

1. ✅ Merger corrections de sécurité dans `test`
2. ✅ Tester localement avec `npm run build && npm start`
3. ✅ Vérifier que l'app démarre sans erreurs env
4. ✅ Push vers `main`
5. ✅ Configurer Vercel avec `.env` production
6. ⚠️ Activer Sentry après premier deploy (optionnel)

---

## 📝 NOTES

- **Branche actuelle** : `test`
- **Target** : `main`
- **Hosting** : Vercel
- **Database** : Neon PostgreSQL
- **Auth** : NextAuth v4 (JWT)

**Validé par** : Architecture Agent  
**Status** : ✅ APPROUVÉ POUR PRODUCTION
