# ROADMAP.md – Priorités & Suivi du Projet Devisio

Ce fichier contient les priorités de développement, réparties par niveaux d’urgence et organisées autour des objectifs de lancement.

---

## 🔴 Tâches Critiques (à faire immédiatement)

1. ✅ ~~Isolation multi-tenant : filtrage par `businessId` (middleware Prisma ou actions)~~ - **COMPLÉTÉ** : `businessId` ajouté à la session, helpers `getSessionWithBusiness()` et `getBusinessId()` créés dans `lib/utils.ts`
2. ✅ ~~Création automatique de Business à l'inscription (Google et Credentials)~~ - **COMPLÉTÉ** : Business créé automatiquement pour OAuth (déjà fait) et credentials (maintenant corrigé)
3. ✅ ~~Validation de tous les formulaires avec Zod (`lib/validations/`)~~ - **COMPLÉTÉ** : Schémas créés pour auth, business, client, service et quote avec typage TypeScript et messages en français
4. ✅ ~~Création d'un fichier `.env.example`~~ - **COMPLÉTÉ** : Fichier existe et est documenté dans CLAUDE.md

---

## 🟠 Tâches Haute Priorité (avant mise en production)

5. Rate limiting sur les endpoints sensibles (`@upstash/ratelimit`)
6. Migration vers Server Actions pour mutations (CRUD quotes, clients, services)
7. Logging structuré + gestion des erreurs (e.g. Error Boundaries React)
8. Sécurisation des variables d’environnement avec `zodEnv`

---

## 🟡 Moyenne Priorité

9. Exports globaux (`index.ts`) dans `components/`
10. Optimisation des requêtes Prisma (`select`, `include`, indexation BDD)
11. Intégration de `sonner` pour feedback utilisateur (toasts)

---

## 🟢 Basse Priorité

12. Messages d’erreurs plus précis et localisés
13. Écriture de tests (unitaires, end-to-end avec Playwright)
14. Monitoring performance (Sentry, Core Web Vitals)

---

## Suivi d'Avancement

| Priorité | Nombre de tâches | Complétées | Restantes |
|----------|------------------|------------|-----------|
| 🔴       | 4                | 4          | 0         |
| 🟠       | 4                | 0          | 4         |
| 🟡       | 3                | 0          | 3         |
| 🟢       | 3                | 0          | 3         |
| **Total**| **14**           | **4**      | **10**    |

---

## Estimation de Charge

- Temps estimé total : **~25 heures de développement**
- Temps avant MVP public (hors bugs) : **2 à 3 jours**

---

## Liens utiles

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`VALIDATION.md`](VALIDATION.md)
- [`UX.md`](UX.md)
- [`WORKFLOW.md`](WORKFLOW.md)
- [`AUTH.md`](AUTH.md)

---

*Dernière mise à jour : 2025-12-01*

