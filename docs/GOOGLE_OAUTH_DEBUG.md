# 🔍 Debug Google OAuth - Erreur 500

## Symptôme

Erreur 500 (Intexrnal Server Error) lors du clic sur le bouton "Google" dans la page de login.

## Causes Possibles

### 1. ❌ URL de Callback Non Autorisée (CAUSE LA PLUS PROBABLE)

**Symptôme**: L'erreur 500 survient immédiatement au clic, avant même d'atteindre Google.

**Solution**: Vérifier la configuration dans Google Cloud Console

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionner votre projet
3. Navigation: **APIs & Services** → **Credentials**
4. Cliquer sur votre Client ID OAuth 2.0
5. Dans **Authorized redirect URIs**, ajouter:
   ```
   http://localhost:3000/api/auth/callback/google
   https://votre-domaine.com/api/auth/callback/google
   ```

**⚠️ IMPORTANT**:

- L'URL doit être EXACTEMENT `/api/auth/callback/google`
- Pas de slash à la fin
- Utiliser `http://` en dev, `https://` en prod

### 2. ❌ Credentials Invalides

**Vérification**:

```bash
# Voir les logs de démarrage
npm run dev

# Chercher cette ligne:
# ✨ Optional Features:
#   Google OAuth: ✅  # Doit être ✅
```

Si Google OAuth est ❌, vérifier `.env.local`:

```env
GOOGLE_CLIENT_ID="votre-client-id"
GOOGLE_CLIENT_SECRET="votre-secret"
```

### 3. ❌ Erreur de Base de Données

**Cause**: Échec de création User ou Business dans le callback `signIn`.

**Vérification**: Avec les logs ajoutés, chercher dans la console:

```
[Google OAuth] Début du callback signIn pour: user@example.com
[Google OAuth] ERREUR dans le callback signIn: ...
```

**Solutions**:

- Vérifier que `DATABASE_URL` et `DIRECT_URL` sont valides
- Tester la connexion Prisma: `npx prisma studio`
- Vérifier les migrations: `npx prisma migrate status`

### 4. ❌ Problème de JWT/Session

**Cause**: Échec dans le callback `jwt` lors de la récupération du `businessId`.

**Vérification**: Chercher dans les logs:

```
[JWT Callback] ⚠️ Aucun businessId trouvé pour user: xyz
```

**Solution**: Exécuter le script de réparation:

```bash
npx tsx scripts/fix-missing-business.ts
```

## Logs Ajoutés pour Debug

Les logs suivants ont été ajoutés dans `lib/auth.ts`:

### Callback signIn (Google OAuth)

```
[Google OAuth] Début du callback signIn pour: email
[Google OAuth] Utilisateur trouvé: true/false
[Google OAuth] Création du nouvel utilisateur
[Google OAuth] Utilisateur créé avec ID: xyz
[Google OAuth] Création du Business pour l'utilisateur: xyz
[Google OAuth] Business créé avec succès
[Google OAuth] Callback signIn terminé avec succès
```

### Callback JWT

```
[JWT Callback] Processing token for user: xyz
[JWT Callback] Business trouvé: true/false
[JWT Callback] Provider Google ajouté au token
[JWT Callback] ⚠️ Aucun businessId trouvé pour user: xyz  # Si problème
```

### Frontend (LoginForm)

```
[LoginForm] Démarrage de la connexion Google OAuth...
[LoginForm] Erreur OAuth détectée: OAuthCallback
```

## Comment Tester

1. **Ouvrir la console du navigateur** (F12 → Console)
2. **Ouvrir le terminal** où tourne `npm run dev`
3. **Cliquer sur "Google"** dans la page de login
4. **Observer les logs** dans les deux endroits

### Exemple de Logs Normaux (Succès)

**Terminal**:

```
[Google OAuth] Début du callback signIn pour: user@gmail.com
[Google OAuth] Utilisateur trouvé: false
[Google OAuth] Création du nouvel utilisateur
[Google OAuth] Utilisateur créé avec ID: clabcd1234
[Google OAuth] Création du Business pour l'utilisateur: clabcd1234
[Google OAuth] Business créé avec succès
[Google OAuth] Callback signIn terminé avec succès
[JWT Callback] Processing token for user: clabcd1234
[JWT Callback] Business trouvé: true
[JWT Callback] Provider Google ajouté au token
```

**Navigateur**: Redirection vers `/dashboard`

### Exemple de Logs avec Erreur

**Terminal**:

```
[Google OAuth] Début du callback signIn pour: user@gmail.com
[Google OAuth] ERREUR dans le callback signIn: Error: ...
[Google OAuth] Stack trace: ...
```

**Navigateur**: Redirection vers `/login?error=Configuration`

## Affichage d'Erreur Amélioré

La page `/login` affiche maintenant l'erreur détectée:

- **Code d'erreur** dans l'URL: `/login?error=OAuthCallback`
- **Message traduit** dans un bandeau rouge
- **Logs détaillés** dans la console navigateur

## Checklist de Résolution

- [ ] Les credentials Google sont dans `.env.local`
- [ ] L'URL de callback est autorisée dans Google Cloud Console
- [ ] La connexion à la base de données fonctionne (`npx prisma studio`)
- [ ] Les logs montrent où l'erreur se produit
- [ ] Le script `fix-missing-business.ts` a été exécuté si besoin

## Configuration Google Cloud Console (Étapes Détaillées)

1. **Créer ou sélectionner un projet**

   - Aller sur https://console.cloud.google.com/
   - Créer un nouveau projet ou sélectionner le projet existant

2. **Activer Google+ API** (requis pour OAuth)

   - Navigation: **APIs & Services** → **Library**
   - Rechercher "Google+ API"
   - Cliquer sur **Enable**

3. **Créer des Credentials OAuth 2.0**

   - Navigation: **APIs & Services** → **Credentials**
   - Cliquer sur **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Type d'application: **Web application**
   - Nom: "Solkant Dev" ou "Solkant Prod"

4. **Configurer les URLs autorisées**

   **Authorized JavaScript origins**:

   ```
   http://localhost:3000
   https://votre-domaine.vercel.app
   ```

   **Authorized redirect URIs**:

   ```
   http://localhost:3000/api/auth/callback/google
   https://votre-domaine.vercel.app/api/auth/callback/google
   ```

5. **Copier les credentials**

   - Client ID → Copier dans `.env.local` comme `GOOGLE_CLIENT_ID`
   - Client secret → Copier dans `.env.local` comme `GOOGLE_CLIENT_SECRET`

6. **Redémarrer le serveur**
   ```bash
   # Arrêter le serveur (Ctrl+C)
   npm run dev
   ```

## Test Final

Après configuration:

1. Redémarrer le serveur: `npm run dev`
2. Vérifier les logs: `Google OAuth: ✅`
3. Ouvrir http://localhost:3000/login
4. Cliquer sur "Google"
5. Autoriser l'accès dans la popup Google
6. Vérifier la redirection vers `/dashboard`

## Ressources

- [NextAuth Google Provider](https://next-auth.js.org/providers/google)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [Architecture Solkant](.github/copilot-instructions.md)

---

**Dernière mise à jour**: 3 décembre 2025
