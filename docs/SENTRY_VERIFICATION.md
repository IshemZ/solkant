# 🧪 Guide de Vérification Sentry

## ✅ Checklist de Configuration

### 1. Variables d'Environnement

**Vérifier `.env.local`** :

```bash
grep "SENTRY" .env.local
```

Doit contenir :

- ✅ `SENTRY_DSN` (commence par `https://...`)
- ✅ `SENTRY_ORG` (ton organisation Sentry)
- ✅ `SENTRY_PROJECT` (nom du projet : `devisio`)
- ✅ `SENTRY_AUTH_TOKEN` (token API Sentry)

### 2. Fichiers de Configuration

**Vérifier que ces fichiers existent** :

```bash
ls -la | grep sentry
```

Doit afficher :

- ✅ `sentry.server.config.ts`
- ✅ `sentry.client.config.ts`
- ✅ `sentry.edge.config.ts`
- ✅ `instrumentation.ts`
- ✅ `instrumentation-client.ts`

### 3. Imports dans Actions

**Vérifier l'import Sentry dans les Server Actions** :

```bash
grep -l "import.*Sentry" app/actions/*.ts
```

Doit afficher :

- ✅ `app/actions/clients.ts`
- ✅ `app/actions/quotes.ts`
- ✅ `app/actions/services.ts`

### 4. Pas de DSN Hardcodé

**Rechercher les DSN hardcodés** :

```bash
grep -r "https://.*@.*sentry.io" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next .
```

Résultat attendu : **Aucun résultat** (ou uniquement dans `.env*` files)

---

## 🧪 Tests Manuels

### Test 1 : API Route de Test

1. **Démarrer le serveur** :

   ```bash
   npm run dev
   ```

2. **Appeler l'API de test** :

   ```bash
   curl http://localhost:3000/api/test-sentry
   ```

3. **Résultat attendu** :

   ```json
   {
     "success": true,
     "message": "Test Sentry exécuté avec succès",
     "instructions": [...]
   }
   ```

4. **Vérifier sur Sentry.io** :
   - Aller sur https://sentry.io
   - Sélectionner projet "devisio"
   - Tu devrais voir **2 événements récents** :
     - 📨 Message : "Test Sentry: Message de test"
     - ❌ Erreur : "Test Sentry: Erreur de test volontaire"

### Test 2 : Error Boundary Client

1. **Ouvrir le navigateur** : http://localhost:3000
2. **Déclencher une erreur** :
   - Modifier temporairement un composant pour throw une erreur
   - Ou utiliser la console : `throw new Error("Test error boundary")`
3. **Vérifier sur Sentry** : L'erreur doit apparaître avec tag `location: "error-boundary"`

### Test 3 : Server Action Error

1. **Créer un client avec données invalides** :
   - Email vide ou format invalide
   - Nom manquant
2. **Vérifier les logs** :
   - Console Next.js doit afficher l'erreur
   - Sentry doit capturer avec tag `action: "createClient"`

---

## 🔍 Vérifications sur Sentry.io

### Dashboard → Issues

**Filtres à tester** :

- `environment:development` → Doit afficher les tests locaux
- `environment:production` → Vide jusqu'au déploiement
- `test:manual` → Événements de l'API `/test-sentry`

### Performance → Transactions

**Métriques attendues** :

- Sample rate dev : **100%** (toutes les requêtes)
- Sample rate prod : **10%** (échantillonnage 1 sur 10)

### Settings → Client Keys (DSN)

**Configuration attendue** :

- ✅ **1 seul DSN** pour dev + prod
- ✅ **Pas de DSN révoqué** (si ancien DSN hardcodé était exposé)

---

## 🐛 Résolution de Problèmes

### Erreur : "DSN not configured"

**Cause** : Variable `SENTRY_DSN` manquante ou vide

**Solution** :

```bash
echo "SENTRY_DSN=https://..." >> .env.local
```

### Erreur : "Invalid DSN"

**Cause** : Format DSN incorrect ou DSN révoqué

**Solution** :

1. Aller sur Sentry.io → Settings → Client Keys
2. Copier le DSN actif
3. Mettre à jour `.env.local`

### Événements non reçus sur Sentry

**Vérifications** :

1. ✅ DSN correct dans `.env.local`
2. ✅ Serveur Next.js redémarré après modification
3. ✅ Internet actif (Sentry envoie en ligne)
4. ✅ Pas de bloqueur de requêtes (VPN, firewall)

**Test réseau** :

```bash
curl -I https://sentry.io
```

### Sample Rate trop élevé en production

**Symptôme** : Quota Sentry gratuit épuisé rapidement

**Solution** :
Modifier `sentry.server.config.ts` et `sentry.edge.config.ts` :

```typescript
tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
// Réduire de 10% à 5% si nécessaire
```

---

## 📊 Configuration RGPD

**Vérifier que ces options sont actives** :

### `sentry.server.config.ts`

```typescript
sendDefaultPii: false,  // ✅ Pas de données personnelles auto
```

### `sentry.client.config.ts`

```typescript
replayIntegration({
  maskAllText: true, // ✅ Texte masqué dans replays
  blockAllMedia: true, // ✅ Médias bloqués
  maskAllInputs: true, // ✅ Inputs masqués
});
```

### Tags à éviter

```typescript
// ❌ NE PAS faire :
Sentry.captureException(error, {
  extra: {
    email: user.email, // ❌ Email = PII
    phone: client.phone, // ❌ Téléphone = PII
  },
});

// ✅ FAIRE :
Sentry.captureException(error, {
  extra: {
    userId: user.id, // ✅ ID anonyme OK
    businessId: businessId, // ✅ ID métier OK
  },
});
```

---

## 🚀 Checklist Pre-Production

Avant de déployer sur Vercel :

- [ ] DSN non hardcodé (uniquement dans `.env.local`)
- [ ] Sample rates configurés (10% prod, 100% dev)
- [ ] RGPD : `sendDefaultPii: false` partout
- [ ] RGPD : Replay masking activé
- [ ] Variables Vercel configurées :
  - `SENTRY_DSN`
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`
  - `SENTRY_AUTH_TOKEN`
- [ ] Test API `/test-sentry` réussi localement
- [ ] Événements visibles sur Sentry.io
- [ ] Pas de secrets dans Git : `git log --all -p | grep "sentry"`

---

## 📚 Ressources

- [Documentation Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [RGPD et Sentry](https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/)
- [Sample Rates](https://docs.sentry.io/platforms/javascript/configuration/sampling/)
- [Error Boundaries](https://docs.sentry.io/platforms/javascript/guides/nextjs/features/error-boundary/)

---

**Dernière mise à jour** : 3 décembre 2025
