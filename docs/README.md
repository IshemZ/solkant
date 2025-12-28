# 📚 Documentation Solkant

Bienvenue dans la documentation technique de Solkant.

---

## 🚀 Démarrage Rapide

### Pour les Développeurs

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Guide complet de déploiement en production
   - Configuration Vercel
   - Gestion des environnements (dev/prod)
   - Variables d'environnement
   - Troubleshooting

### Pour l'Accessibilité

2. **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** - Standards d'accessibilité du projet
3. **[A11Y_AUDIT_REPORT.md](./A11Y_AUDIT_REPORT.md)** - Rapport d'audit détaillé
4. **[A11Y_COLOR_AUDIT.md](./A11Y_COLOR_AUDIT.md)** - Analyse des contrastes de couleurs
5. **[WEEK7_A11Y_SUMMARY.md](./WEEK7_A11Y_SUMMARY.md)** - Résumé des améliorations

### Pour le Debugging

6. **[HYDRATION_DEBUG_GUIDE.md](./HYDRATION_DEBUG_GUIDE.md)** - Résoudre les erreurs d'hydration
7. **[HYDRATION_FIX.md](./HYDRATION_FIX.md)** - Solutions aux problèmes d'hydration
8. **[TESTS_HYDRATION.md](./TESTS_HYDRATION.md)** - Tests pour l'hydration

### Configuration Avancée

9. **[ENV_VALIDATION_LOGGING.md](./ENV_VALIDATION_LOGGING.md)** - Validation des variables d'environnement
10. **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Configuration email (à venir)

---

## ⚠️ Important : Variables d'Environnement

### En Développement

```bash
# Copier le template
cp .env.example .env.local

# Éditer avec vos credentials locaux
nano .env.local
```

### En Production

**❌ NE PAS créer `.env.production`**

Les variables de production sont gérées dans **Vercel Dashboard** uniquement.

Voir **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** pour les détails.

---

## 🏗️ Architecture

Solkant utilise :

- **Next.js 16** (App Router)
- **NextAuth v4** (JWT strategy)
- **Prisma ORM** + PostgreSQL (Supabase)
- **Multi-tenancy** via `businessId` dans JWT

Pattern principal : **Server Components** + **Server Actions**

---

## 📖 Ressources

- **Checklist Production** : `/PRODUCTION_CHECKLIST.md` (racine du projet)
- **Instructions Architecture** : `/.github/copilot-instructions.md`
- **Structure du Projet** : `/STRUCTURE_ANALYSIS.md`

---

## 🆘 Besoin d'Aide ?

1. **Erreurs de build** → Vérifier `ENV_VALIDATION_LOGGING.md`
2. **Erreurs d'hydration** → Vérifier `HYDRATION_DEBUG_GUIDE.md`
3. **Déploiement bloqué** → Vérifier `DEPLOYMENT_GUIDE.md`
4. **Problèmes d'accessibilité** → Vérifier `ACCESSIBILITY.md`

---

**Dernière mise à jour** : 3 décembre 2025
