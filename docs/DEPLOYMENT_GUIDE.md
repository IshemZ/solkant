# 🚀 Guide de Déploiement Production - Solkant

**Date** : 3 décembre 2025  
**Plateforme** : Vercel  
**Database** : Supabase PostgreSQL

---

## ⚠️ Principe Fondamental

**JAMAIS de fichier `.env.production` dans le projet !**

- ❌ `.env.production` → Risque de commit accidentel
- ✅ Vercel Dashboard → Configuration sécurisée

---

## 📋 Checklist Pré-Déploiement

### 1. Créer une Base de Données Production

**Supabase Dashboard** : https://supabase.com/dashboard

```bash
# 1. Créer un nouveau projet
Nom: devisio-production
Région: EU West (Paris) - aws-0-eu-west-3

# 2. Copier les credentials
- DATABASE_URL (pooled - port 6543)
- DIRECT_URL (direct - port 5432)
```

### 2. Appliquer les Migrations

```bash
# Configurer temporairement les URLs de prod
export DATABASE_URL="postgresql://postgres.[prod]@...6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres.[prod]@...5432/postgres"

# Appliquer les migrations
npx prisma migrate deploy

# Vérifier
npx prisma studio
```

### 3. Créer des Credentials Google OAuth Production

**Google Cloud Console** : https://console.cloud.google.com/apis/credentials

```
1. Créer "OAuth 2.0 Client ID"
2. Application type: Web application
3. Name: Solkant Production

Authorized JavaScript origins:
  https://solkant.vercel.app

Authorized redirect URIs:
  https://solkant.vercel.app/api/auth/callback/google

4. Copier Client ID et Client Secret
```

### 4. Générer un Nouveau Secret NextAuth

```bash
openssl rand -base64 32
# Copier le résultat
```

---

## 🔧 Configuration Vercel

### Option A : Via Dashboard (Recommandé)

1. **Vercel Dashboard** → Votre projet → Settings → Environment Variables

2. **Ajouter les variables** :

| Variable               | Value                                                          | Environment |
| ---------------------- | -------------------------------------------------------------- | ----------- |
| `DATABASE_URL`         | `postgresql://postgres.[prod]@...6543/postgres?pgbouncer=true` | Production  |
| `DIRECT_URL`           | `postgresql://postgres.[prod]@...5432/postgres`                | Production  |
| `NEXTAUTH_URL`         | `https://solkant.vercel.app`                                   | Production  |
| `NEXTAUTH_SECRET`      | `[résultat de openssl rand]`                                   | Production  |
| `GOOGLE_CLIENT_ID`     | `[prod-client-id].apps.googleusercontent.com`                  | Production  |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-[prod-secret]`                                         | Production  |
| `NODE_ENV`             | `production`                                                   | Production  |

3. **Save** pour chaque variable

### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Lier le projet (depuis le repo)
cd /Users/ishemz/myprogramfiles/devisio
vercel link

# Ajouter les variables
vercel env add DATABASE_URL production
# Coller la valeur quand demandé
# ... répéter pour chaque variable
```

---

## 🚀 Déploiement

### Depuis la Branche Main

```bash
# 1. S'assurer d'être sur main
git checkout main

# 2. Merger les derniers changements de test
git merge test

# 3. Push vers GitHub (déclenche auto-deploy Vercel)
git push origin main

# OU déployer directement avec CLI
vercel --prod
```

### Preview Deployment (Branche test)

```bash
# Les pushs sur d'autres branches créent des previews automatiques
git push origin test
# URL preview: https://solkant-[hash].vercel.app
```

---

## ✅ Vérifications Post-Déploiement

### 1. Health Check

```bash
# Vérifier que l'app démarre
curl https://solkant.vercel.app

# Vérifier les API routes
curl https://solkant.vercel.app/api/auth/session
```

### 2. Tests Manuels

- [ ] Page d'accueil charge sans erreur
- [ ] Login avec email/password fonctionne
- [ ] Login Google OAuth fonctionne
- [ ] Créer un client → OK
- [ ] Créer un service → OK
- [ ] Créer un devis → OK
- [ ] Générer PDF → OK
- [ ] Dashboard affiche les stats

### 3. Logs Vercel

```bash
# Via CLI
vercel logs --prod

# Via Dashboard
Vercel Dashboard → Votre projet → Deployments → Latest → Logs
```

Vérifier qu'il n'y a **aucune erreur** :

- ❌ `TypeError: Cannot read property 'businessId'`
- ❌ `Error: NEXTAUTH_SECRET not defined`
- ❌ `PrismaClientInitializationError`

---

## 🔄 Workflow de Développement

```
┌─────────────┐
│  Branche    │
│    test     │  ← Développement actif
└──────┬──────┘
       │ git merge
       ↓
┌─────────────┐
│  Branche    │
│    main     │  ← Production stable
└──────┬──────┘
       │ auto-deploy
       ↓
┌─────────────┐
│   Vercel    │
│ Production  │  ← https://solkant.vercel.app
└─────────────┘
```

### Déployer une Feature

```bash
# 1. Développer sur test
git checkout test
# ... faire les changements
git add .
git commit -m "feat: nouvelle feature"
git push origin test

# 2. Vérifier le preview Vercel
# URL: https://solkant-[hash].vercel.app

# 3. Si OK, merger dans main
git checkout main
git merge test
git push origin main

# 4. Vercel déploie automatiquement en production
```

---

## 🐛 Troubleshooting

### Erreur: "NEXTAUTH_SECRET not defined"

**Cause** : Variable manquante dans Vercel

**Solution** :

```bash
vercel env add NEXTAUTH_SECRET production
# Coller le secret généré avec openssl
```

### Erreur: "Google OAuth redirect_uri_mismatch"

**Cause** : URI non autorisée dans Google Console

**Solution** :

1. Google Cloud Console → Credentials
2. Éditer OAuth Client ID
3. Ajouter `https://solkant.vercel.app/api/auth/callback/google`

### Erreur: "PrismaClient initialization error"

**Cause** : DATABASE_URL ou DIRECT_URL invalide

**Solution** :

```bash
# Vérifier les URLs dans Vercel
vercel env ls

# Retester la connexion depuis Supabase Dashboard
```

### Base de Données Vide Après Deploy

**Cause** : Migrations non appliquées

**Solution** :

```bash
# Appliquer les migrations en prod
DATABASE_URL="[prod-url]" DIRECT_URL="[prod-direct-url]" npx prisma migrate deploy
```

---

## 🔒 Sécurité Production

### ✅ Checklist

- [x] HTTPS forcé (automatique Vercel)
- [x] Security headers dans `next.config.ts`
- [x] Rate limiting sur `/api/auth/register`
- [x] Input sanitization (XSS protection)
- [x] Secrets différents dev/prod
- [x] Database séparée dev/prod
- [ ] Monitoring (Sentry - à configurer)
- [ ] Backups automatiques (Supabase settings)

### Variables Sensibles

**JAMAIS committer** :

- ❌ `.env.local`
- ❌ `.env.production`
- ❌ Fichiers contenant des secrets

**Rotation des Secrets** (tous les 90 jours) :

1. Générer nouveau `NEXTAUTH_SECRET`
2. Mettre à jour dans Vercel
3. Redéployer

---

## 📊 Monitoring

### Vercel Analytics

```bash
# Activer dans Dashboard
Vercel → Projet → Analytics → Enable

# Voir les métriques
- Page views
- Unique visitors
- Top pages
- Response times
```

### Logs

```bash
# Temps réel
vercel logs --prod --follow

# Dernières 100 lignes
vercel logs --prod -n 100
```

---

## 🎯 Résumé des Commandes

```bash
# Setup initial
vercel login
vercel link

# Déploiement
git push origin main          # Auto-deploy via GitHub
vercel --prod                 # Direct deploy

# Variables
vercel env add VAR_NAME production
vercel env ls
vercel env pull .env.vercel.local

# Monitoring
vercel logs --prod
vercel domains ls
vercel certs ls

# Rollback si problème
vercel rollback [deployment-url]
```

---

## 📞 Support

- **Vercel** : https://vercel.com/docs
- **Supabase** : https://supabase.com/docs
- **NextAuth** : https://next-auth.js.org/deployment

---

**Dernière mise à jour** : 3 décembre 2025  
**Validé par** : Architecture Agent ✅
