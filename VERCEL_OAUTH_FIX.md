# 🔧 Fix Google OAuth sur Vercel Preview/Production

## Problème

Google OAuth fonctionne sur `localhost:3000` mais redirige vers `/login` après authentification sur Vercel Preview/Production.

## Cause

1. ❌ URL de callback Google OAuth non configurée pour Vercel
2. ❌ Variables d'environnement manquantes sur Vercel
3. ✅ **CORRIGÉ** : Conflit PrismaAdapter + JWT strategy

---

## ✅ Solution - Étapes à suivre

### Étape 1 : Trouver l'URL exacte de votre déploiement Vercel Preview

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **Devisio**
3. Cliquez sur l'onglet **Deployments**
4. Trouvez le déploiement de la branche `develop`
5. Copiez l'URL complète (exemple : `https://devisio-git-develop-ishemz.vercel.app`)

---

### Étape 2 : Ajouter l'URL de callback dans Google Cloud Console

1. Allez sur [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Connectez-vous avec le compte Google utilisé pour créer le projet OAuth
3. Cliquez sur votre **OAuth 2.0 Client ID** (celui utilisé pour Devisio)
4. Dans la section **"Authorized redirect URIs"**, cliquez sur **"ADD URI"**
5. Ajoutez cette URL (remplacez par votre URL Vercel exacte) :

   ```
   https://devisio-git-develop-[VOTRE-USERNAME].vercel.app/api/auth/callback/google
   ```

   **Format exact** : `https://[URL-VERCEL-EXACTE]/api/auth/callback/google`

6. Cliquez sur **"SAVE"**

**Note** : Vous devrez répéter cette étape pour chaque environnement :
- Preview (branche `develop`) : `https://devisio-git-develop-....vercel.app/api/auth/callback/google`
- Production (branche `main`) : `https://devisio-....vercel.app/api/auth/callback/google`
- Domaine custom (si vous en avez un) : `https://votre-domaine.com/api/auth/callback/google`

---

### Étape 3 : Configurer les variables d'environnement sur Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **Devisio**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

#### Pour l'environnement **Preview** (branche develop)

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `NEXTAUTH_URL` | `https://devisio-git-develop-[USERNAME].vercel.app` | Preview |
| `NEXTAUTH_SECRET` | Votre secret actuel (même que local) | Preview |
| `GOOGLE_CLIENT_ID` | Votre Google Client ID | Preview |
| `GOOGLE_CLIENT_SECRET` | Votre Google Client Secret | Preview |
| `DATABASE_URL` | Votre Supabase Database URL | Preview |
| `DIRECT_URL` | Votre Supabase Direct URL | Preview |

#### Pour l'environnement **Production** (branche main)

Répétez les mêmes variables, mais :
- Sélectionnez **Production** au lieu de Preview
- Pour `NEXTAUTH_URL`, utilisez l'URL de production (ex: `https://devisio.vercel.app` ou votre domaine custom)

**⚠️ Important** :
- `NEXTAUTH_URL` doit correspondre **exactement** à l'URL de déploiement
- `NEXTAUTH_SECRET` : Utilisez le même secret que votre `.env.local`
- Les credentials Google sont les mêmes pour tous les environnements

---

### Étape 4 : Redéployer sur Vercel

1. Sur Vercel Dashboard → **Deployments**
2. Trouvez le dernier déploiement de la branche `develop`
3. Cliquez sur les **trois points** (•••) à droite
4. Cliquez sur **"Redeploy"**
5. Attendez que le déploiement soit terminé

**Ou** poussez un nouveau commit :

```bash
git add .
git commit -m "Fix: Configure NextAuth for Vercel deployment"
git push origin develop
```

---

### Étape 5 : Tester l'authentification Google

1. Allez sur votre URL Vercel Preview : `https://devisio-git-develop-[USERNAME].vercel.app`
2. Cliquez sur **"Se connecter"**
3. Cliquez sur **"Continuer avec Google"**
4. Sélectionnez votre compte Google
5. ✅ Vous devriez être redirigé vers `/dashboard` avec succès !

---

## 🔍 Vérification des URLs de callback

Voici toutes les URLs de callback que vous devriez avoir dans Google Cloud Console :

```
http://localhost:3000/api/auth/callback/google
https://devisio-git-develop-[USERNAME].vercel.app/api/auth/callback/google
https://devisio-[USERNAME].vercel.app/api/auth/callback/google
```

Si vous avez un domaine custom plus tard :
```
https://votre-domaine.com/api/auth/callback/google
```

---

## 🐛 Debugging

Si ça ne fonctionne toujours pas après ces étapes :

1. **Vérifier les logs Vercel** :
   - Vercel Dashboard → Deployments → Votre déploiement → Runtime Logs
   - Cherchez les erreurs NextAuth

2. **Vérifier les variables d'environnement** :
   - Vercel Dashboard → Settings → Environment Variables
   - Assurez-vous que `NEXTAUTH_URL` est bien défini pour Preview

3. **Vérifier l'URL de callback Google** :
   - Elle doit correspondre **EXACTEMENT** à l'URL Vercel
   - Pas de trailing slash `/`
   - Protocole HTTPS (pas HTTP)

4. **Activer le debug NextAuth** :
   - Dans `lib/auth.ts`, `debug: true` est déjà activé en development
   - Vous pouvez le forcer à `true` temporairement pour voir les logs détaillés

---

## 📝 Modifications apportées au code

### `lib/auth.ts`

**Avant** :
```typescript
adapter: PrismaAdapter(prisma),
session: {
  strategy: 'jwt',
}
```

**Après** :
```typescript
// Adapter disabled for JWT strategy
// adapter: PrismaAdapter(prisma),
session: {
  strategy: 'jwt',
}
```

**Raison** : Le `PrismaAdapter` est incompatible avec la stratégie JWT. Sans adapter, NextAuth gère tout via JWT, ce qui est plus simple et fonctionne mieux sur Vercel.

Le callback `signIn` a été mis à jour pour créer manuellement les enregistrements User et Business en base de données lors de l'authentification Google.

---

## ✅ Checklist finale

Avant de tester, vérifiez que :

- [ ] Les URLs de callback sont ajoutées dans Google Cloud Console
- [ ] Les 6 variables d'environnement sont configurées sur Vercel (Preview)
- [ ] `NEXTAUTH_URL` correspond exactement à l'URL Vercel
- [ ] Le déploiement Vercel a été redéployé après configuration des variables
- [ ] Aucun espace ou caractère supplémentaire dans les variables d'environnement

---

*Date de création : 2025-12-01*
