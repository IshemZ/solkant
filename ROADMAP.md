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

### Navigation & UX (Critique - Review UX 2025-12-01)

- [x] **Navigation mobile responsive** - Menu hamburger avec overlay pour accès sections sur mobile - **COMPLÉTÉ** : Composant MobileNav créé avec Radix UI Dialog, intégré dans DashboardNav
- [x] **Indicateur de page active** - Utiliser `usePathname()` pour highlighter la page courante dans DashboardNav - **COMPLÉTÉ** : Border-bottom sur la page active
- [x] **Notifications toast** - Installer et configurer `sonner` pour feedback success/error sur toutes actions CRUD - **COMPLÉTÉ** : Sonner installé, Toaster configuré dans layout, toasts ajoutés dans tous les composants CRUD (ClientsList, ServicesList, QuotesList, QuoteForm, BusinessSettingsForm)
- [x] **Fonctionnaliser actions rapides dashboard** - Ajouter hrefs/navigation sur les 3 boutons "Actions rapides" - **COMPLÉTÉ** : Boutons convertis en Links vers /dashboard/devis/nouveau, /dashboard/clients, /dashboard/services
- [x] **Modal de confirmation personnalisée** - Remplacer `confirm()` natif par composant réutilisable - **COMPLÉTÉ** : ConfirmDialog créé avec Radix UI, intégré dans ClientsList, ServicesList et QuotesList
- [ ] **Breadcrumbs** - Ajouter fil d'ariane sur pages imbriquées (ex: `/dashboard/devis/nouveau`)

### Sécurité & Performance

- [ ] Rate limiting sur les endpoints sensibles (`@upstash/ratelimit`)
- [ ] Migration vers Server Actions pour mutations (CRUD quotes, clients, services)
- [ ] Logging structuré + gestion des erreurs (e.g. Error Boundaries React)
- [ ] Sécurisation des variables d'environnement avec `zodEnv`)

---

## 🟡 Moyenne Priorité

- [ ] Améliorer layout dashboard (considérer sidebar latérale persistante)
- [ ] Tableau clients responsive (vue cards sur mobile au lieu de overflow-x-auto)
- [ ] Loading states élégants (skeletons au lieu de texte "Création...")
- [ ] Exports globaux (`index.ts`) dans `components/`
- [ ] Optimisation des requêtes Prisma (`select`, `include`, indexation BDD)

---

## 🟢 Basse Priorité

- [ ] Messages d'erreurs plus précis et localisés
- [ ] Écriture de tests (unitaires, end-to-end avec Playwright)
- [ ] Monitoring performance (Sentry, Core Web Vitals)
- [ ] Accessibilité complète (attributs ARIA, navigation clavier, skip links)
- [ ] Stepper visuel pour création de devis
- [ ] Onboarding guidé pour nouveaux utilisateurs

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

