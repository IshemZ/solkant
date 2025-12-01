# AUTH.md – Authentification & Sécurité

## Fournisseur Auth : NextAuth (v5)

- Credentials (email/mot de passe)
- Google OAuth

## Fichiers principaux

- `lib/auth.ts` → configuration complète (providers, callbacks, etc.)
- `app/api/auth/[...nextauth]/route.ts` → handler NextAuth
- `app/api/auth/register/route.ts` → inscription manuelle

## Sécurité

- Mot de passe hashé avec bcryptjs (12 rounds)
- Vérifications de session avant toute mutation sensible
- CSRF protection automatique (NextAuth)

## Gestion de Session

- Stratégie JWT ou session côté serveur
- Ajout de `businessId` dans `session.user` pour filtrage multi-tenant
- Définir dans `types/next-auth.d.ts`

## Callback Google : création auto de Business

Lors du premier login Google, on crée un `Business` s'il n'existe pas :

```ts
async signIn({ user, account }) {
  if (account?.provider === 'google' && user.id) {
    const existingBusiness = await prisma.business.findUnique({ where: { userId: user.id } })

    if (!existingBusiness) {
      await prisma.business.create({
        data: {
          name: `Institut de ${user.name || 'beauté'}`,
          userId: user.id,
          email: user.email || undefined,
        }
      })
    }
  }
  return true
}
```

## Cas particulier corrigé

- **Problème** : utilisateur Google redirigé sur `/login` car pas de Business créé
- **Fix** : callback dans `auth.ts`, script de rattrapage `scripts/fix-missing-business.ts`

## À venir

- Flow "Mot de passe oublié"
- Vérification email (si besoin RGPD)
- 2FA (phase post-lancement)

---

> Pour les validations des formulaires d'inscription, voir [`VALIDATION.md`](VALIDATION.md) Pour les erreurs UX et flows restants, voir [`UX.md`](UX.md)

