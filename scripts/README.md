# Scripts de Sécurité pour les Migrations

Ce répertoire contient les scripts de sécurité pour gérer les migrations Prisma de manière sûre en production.

## 📋 Scripts Disponibles

### 1. `migrate-production.js`

Script principal pour appliquer les migrations en production de manière sécurisée.

**Usage** :
```bash
npm run migrate:prod
```

**Fonctionnalités** :
- ✅ Affiche le statut des migrations avant application
- ✅ Vérifie l'environnement (production/staging/dev)
- ✅ Exige une confirmation manuelle en production
- ✅ Bloque les commandes dangereuses
- ✅ Affiche le statut final après application

**Options** :
```bash
# Skiper la confirmation (CI/CD uniquement)
SKIP_MIGRATION_CONFIRMATION=true npm run migrate:prod

# Ou via argument
node scripts/migrate-production.js --skip-confirmation
```

**Exemple d'exécution** :
```
╔════════════════════════════════════════════════════════╗
║     Script de Migration Sécurisé - Production         ║
╚════════════════════════════════════════════════════════╝

ℹ️  Environnement: production
ℹ️  Plateforme: Vercel
ℹ️  Vérification du statut des migrations...

1 migration found in prisma/migrations

Following migration(s) have not yet been applied:

20251223161902_baseline_init

⚠️  ATTENTION: Vous êtes sur le point d'appliquer des migrations en PRODUCTION!

⚠️  Assurez-vous d'avoir:
  1. Testé les migrations en développement
  2. Fait une sauvegarde de la base de données
  3. Vérifié que les migrations sont réversibles

Voulez-vous vraiment continuer ? (tapez 'OUI' pour confirmer): OUI

ℹ️  Application des migrations...

✅ Migrations appliquées avec succès !

╔════════════════════════════════════════════════════════╗
║          Migrations appliquées avec succès !           ║
╚════════════════════════════════════════════════════════╝
```

---

### 2. `prisma-guard.js`

Guard de sécurité qui bloque les commandes Prisma dangereuses.

**Usage** :
```bash
node scripts/prisma-guard.js <commande>
```

**Exemples** :
```bash
# ✅ Autorisé en dev
node scripts/prisma-guard.js migrate dev --name test

# ❌ Bloqué en production
NODE_ENV=production node scripts/prisma-guard.js migrate reset
# → Erreur: Commande bloquée

# ⚠️ Nécessite confirmation en production
NODE_ENV=production node scripts/prisma-guard.js migrate deploy
# → Warning: Cette commande nécessite une confirmation
```

**Commandes bloquées** :

| Commande | Sévérité | Bloqué en |
|----------|----------|-----------|
| `migrate reset` | CRITIQUE | Production, Staging |
| `db push --force-reset` | CRITIQUE | Production, Staging |
| `db push --accept-data-loss` | CRITIQUE | Production |
| `migrate resolve --rolled-back` | ÉLEVÉE | Production |

**Override (non recommandé)** :
```bash
# Forcer l'exécution (dangereux !)
node scripts/prisma-guard.js migrate deploy --force

# Ou via variable d'environnement
SKIP_PRISMA_GUARD=true node scripts/prisma-guard.js migrate reset
```

---

## 🔐 Sécurités Implémentées

### Protection Multi-Niveaux

1. **Niveau 1 - Build**
   - Le script `npm run build` ne lance PAS de migrations automatiquement
   - Évite les modifications accidentelles lors des déploiements Vercel

2. **Niveau 2 - Script Interactif**
   - `migrate-production.js` exige une confirmation manuelle
   - Affiche clairement ce qui va être modifié
   - Vérifie l'environnement avant exécution

3. **Niveau 3 - Guards**
   - `prisma-guard.js` bloque les commandes dangereuses
   - Détection basée sur l'environnement (NODE_ENV, VERCEL)
   - Protection contre les erreurs humaines

4. **Niveau 4 - CI/CD**
   - GitHub Actions valide toutes les migrations
   - Tests automatiques sur base PostgreSQL fraîche
   - Détection de patterns SQL dangereux

### Vérifications Automatiques

```javascript
// migrate-production.js effectue ces vérifications :
✅ Variables d'environnement (DATABASE_URL, DIRECT_URL)
✅ Environnement d'exécution (dev/staging/production)
✅ Statut des migrations (en attente/appliquées)
✅ Confirmation utilisateur (en production)
✅ Validation post-migration
```

---

## 🚀 Workflows Recommandés

### Développement

```bash
# Modifier le schéma
vim prisma/schema.prisma

# Créer la migration (applique automatiquement en dev)
npx prisma migrate dev --name add_new_field

# Tester localement
npm run test:run
```

### Production

```bash
# 1. Déployer le code (sans migrations)
git push origin main

# 2. Connecter à l'environnement de production
vercel env pull .env.production

# 3. Appliquer les migrations avec sécurité
npm run migrate:prod
# → Le script demandera confirmation

# 4. Vérifier
npx prisma migrate status
```

### CI/CD Pipeline

```bash
# Dans votre pipeline GitHub Actions / Vercel

# Build sans migrations (safe)
npm run build

# Migrations séparées (avec confirmation désactivée)
NODE_ENV=production \
SKIP_MIGRATION_CONFIRMATION=true \
npm run migrate:prod
```

---

## ⚠️ Commandes INTERDITES en Production

| Commande | Raison | Alternative |
|----------|--------|-------------|
| `npx prisma migrate reset` | Supprime toutes les données | Créer une nouvelle migration |
| `npx prisma db push` | Contourne l'historique de migrations | `npx prisma migrate dev` (dev) ou `migrate:prod` (prod) |
| `npx prisma migrate dev` | Conçu pour développement uniquement | `npm run migrate:prod` |
| `npx prisma db push --force-reset` | Force reset = perte de données garantie | N/A - Ne jamais utiliser |

---

## 🆘 En Cas de Problème

### Migration Échouée

```bash
# 1. Vérifier le statut
npx prisma migrate status

# 2. Voir les logs détaillés
vercel logs --follow

# 3. Options de récupération
# Option A - Réessayer
npm run migrate:prod

# Option B - Marquer comme appliquée (si partiellement appliquée)
npx prisma migrate resolve --applied "XXXXXX_migration_name"
```

### Rollback Nécessaire

```bash
# 1. Marquer la migration comme annulée
npx prisma migrate resolve --rolled-back "XXXXXX_migration_name"

# 2. Appliquer le SQL de rollback manuellement
psql $DATABASE_URL < rollback.sql

# 3. Créer une nouvelle migration corrective
npx prisma migrate dev --name fix_rollback
```

### Guard Trop Restrictif

Si le guard bloque une commande légitime :

```bash
# Option 1 - Utiliser --force (comprendre les risques d'abord)
node scripts/prisma-guard.js migrate deploy --force

# Option 2 - Bypass complet (TRÈS DANGEREUX)
SKIP_PRISMA_GUARD=true npx prisma migrate deploy

# Option 3 - Modifier le guard (recommandé)
vim scripts/prisma-guard.js
# Ajuster les règles selon vos besoins
```

---

## 📚 Documentation Connexe

- [Secure Migrations Workflow](../docs/secure-migrations-workflow.md) - Guide complet
- [Migration Strategy](../docs/migration-strategy.md) - Stratégie de migration baseline
- [CLAUDE.md](../CLAUDE.md) - Commandes disponibles

---

## 🔄 Changelog

### v1.0.0 (2024-12-23)

**Ajouts** :
- ✅ `migrate-production.js` - Script de migration sécurisé
- ✅ `prisma-guard.js` - Guard contre commandes dangereuses
- ✅ Workflow GitHub Actions de validation
- ✅ Documentation complète

**Sécurités** :
- 🔒 Confirmation manuelle en production
- 🔒 Blocage de commandes dangereuses
- 🔒 Validation CI/CD automatique
- 🔒 Protection multi-niveaux

---

## 🤝 Contribution

Si vous ajoutez un nouveau script de sécurité :

1. Documentez-le dans ce README
2. Ajoutez des tests si possible
3. Incluez des exemples d'usage
4. Mettez à jour le changelog
