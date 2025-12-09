# 🤖 Agents Copilot - Solkant

Documentation des agents spécialisés pour le développement de Solkant.

> **🔄 Refactorisation 9 décembre 2025** : Architecture optimisée pour éliminer les redondances et clarifier les responsabilités. Voir [ARCHITECTURE_REFACTORING.md](./ARCHITECTURE_REFACTORING.md) pour détails complets.

---

## 📋 Vue d'ensemble

Ce dossier contient **9 agents Copilot spécialisés** avec une architecture **SoC (Separation of Concerns)** pour une interopérabilité optimale.

```
┌─────────────────────────────────────────────┐
│ Frontend Layer    → ARCHITECTURE_NEXTJS     │
│   ↓ délègue mutations à...                 │
│ Business Layer    → DATA_SECURITY           │
│   ↓ délègue queries à...                   │
│ Data Layer        → DATABASE_PRISMA         │
│                                             │
│ Cross-cutting     → UX_UI, PAYMENTS, etc.  │
└─────────────────────────────────────────────┘
```

> **Configuration Partagée** : Consultez [\_shared-config.md](./_shared-config.md) pour les configurations techniques (variables d'env, commandes Prisma).

---

## 🎯 Les 9 Agents

### 1. 🎭 **ORCHESTRATEUR** (`orchestrateur.agent.md`)

**Rôle** : Chef d'orchestre multi-agents

**Quand l'utiliser** :

- Demandes complexes nécessitant 3+ domaines d'expertise
- Besoin d'une vue d'ensemble avant d'agir
- Problèmes multi-couches (UI + DB + sécurité + performance)

**Ce qu'il fait** :

- Analyse la demande et identifie les domaines impactés
- Crée un plan d'action structuré
- Active les agents spécialisés dans le bon ordre
- Fournit une checklist de vérification finale

**Exemple** :

```
@orchestrateur Optimiser le dashboard : chargement lent (5s),
problèmes de queries N+1, et ajouter des skeletons
```

---

### 2. 🏗️ **ARCHITECTURE_NEXTJS** (`architecture-nextjs.agent.md`)

**Rôle** : Expert Frontend - App Router, Server/Client Components, Performance UI

**Responsabilité unique** :

- ✅ Routing, layouts, route groups
- ✅ Décision Server vs Client Components
- ✅ Streaming, Suspense, code splitting
- ✅ Colocation des composants feature-specific (`_components/`)
- ✅ Data fetching patterns (lecture)

**NE FAIT PAS** :

- ❌ Server Actions (mutations) → **DATA_SECURITY**
- ❌ Validation Zod → **DATA_SECURITY**
- ❌ Optimisation queries Prisma → **DATABASE_PRISMA**
- ❌ Composants réutilisables (2+ features) → **UX_UI**

**Exemple** :

```
@architecture-nextjs Comment structurer la nouvelle page
/dashboard/rapports avec streaming pour 10k+ lignes ?
```

---

### 3. 🔒 **DATA_SECURITY** (`data-security.agent.md`)

**Rôle** : Expert Business Layer - Server Actions, Validation, Multi-Tenancy

**Responsabilité unique** :

- ✅ **SEUL agent qui crée/modifie les Server Actions**
- ✅ Validation Zod (schemas + runtime + messages français)
- ✅ Multi-tenancy applicatif (filtrage `businessId` dans queries)
- ✅ Auth guards (session NextAuth, JWT, ownership)
- ✅ Structure de retour `{data, error}`

**NE FAIT PAS** :

- ❌ Modifier schema Prisma → **DATABASE_PRISMA**
- ❌ Créer migrations → **DATABASE_PRISMA**
- ❌ Optimiser indexes → **DATABASE_PRISMA**
- ❌ Créer routes Next.js → **ARCHITECTURE_NEXTJS**

**Exemple** :

```
@data-security Créer Server Action pour créer un devis
avec validation des items et vérification du client ownership
```

---

### 4. 🗄️ **DATABASE_PRISMA** (`database-prisma.agent.md`)

**Rôle** : Expert Data Layer - Schema, Migrations, Optimisation Queries

**Responsabilité unique** :

- ✅ Schema Prisma design et relations
- ✅ Migrations (création, test, déploiement)
- ✅ Indexes pour performance (`@@index([businessId])`)
- ✅ Query optimization (N+1, select vs include, explain plans)
- ✅ Transactions Prisma (`$transaction()`)

**NE FAIT PAS** :

- ❌ Server Actions complètes → **DATA_SECURITY**
- ❌ Validation Zod → **DATA_SECURITY**
- ❌ Filtrage applicatif `businessId` → **DATA_SECURITY**
- ❌ UI/routing → **ARCHITECTURE_NEXTJS**

**Exemple** :

```
@database-prisma La query getClients() est lente (2s)
avec 10,000 clients, comment optimiser ?
```

---

### 5. 🎨 **UX_UI** (`ux-ui.agent.md`)

**Rôle** : Expert Design System, Composants Réutilisables, Accessibilité

**Responsabilité unique** :

- ✅ Design system (`/components/ui/` - shadcn/ui)
- ✅ Composants partagés (`/components/shared/` - 2+ features)
- ✅ Accessibilité WCAG 2.1 AA (ARIA, keyboard nav)
- ✅ Loading states (skeletons, spinners, empty states)
- ✅ Forms UX (error states, feedback utilisateur)

**NE FAIT PAS** :

- ❌ Composants feature-specific (1 feature) → **ARCHITECTURE_NEXTJS**
- ❌ Routing/layouts → **ARCHITECTURE_NEXTJS**
- ❌ Server Actions → **DATA_SECURITY**

**Règle de décision** :

- 1 feature → `_components/` (ARCHITECTURE)
- 2+ features → `/components/shared/` (UX_UI)

**Exemple** :

```
@ux-ui Créer un composant ClientCard réutilisable
utilisé dans /clients et /devis/nouveau
```

---

### 6. 💳 **PAYMENTS** (`payments.agent.md`)

**Rôle** : Expert Stripe - Abonnements, Checkout, Webhooks

**Responsabilité unique** :

- ✅ Stripe checkout sessions
- ✅ Abonnements freemium (trial 30j → 9,99€/mois)
- ✅ Webhooks Stripe (signature, idempotence)
- ✅ Customer portal
- ✅ Guards accès PRO

**Exemple** :

```
@payments Implémenter webhook Stripe pour sync
statut abonnement après renouvellement automatique
```

---

### 7. 🔍 **MONITORING** (`monitoring.agent.md`)

**Rôle** : Expert Sentry, Google Analytics, Observabilité

**Responsabilité unique** :

- ✅ Configuration Sentry (server/client/edge)
- ✅ Capture erreurs avec contexte (tags, breadcrumbs)
- ✅ Google Analytics 4 (events, conversions)
- ✅ Performance monitoring
- ✅ Alertes et dashboards

**Exemple** :

```
@monitoring Capturer erreurs Server Actions dans Sentry
avec contexte businessId et action name
```

---

### 8. 🧪 **TESTING** (`testing.agent.md`)

**Rôle** : Expert Testing - Vitest, Testing Library, Playwright

**Responsabilité unique** :

- ✅ Setup environnement tests (Vitest + Playwright)
- ✅ Tests unitaires (Server Actions, validations Zod)
- ✅ Tests intégration (composants React)
- ✅ Tests E2E (Playwright - flows utilisateur)
  **Exemple** :

```
@testing Créer tests unitaires pour Server Action createClient()
avec validation businessId et ownership checks
```

---

### 9. 📈 **SEO** (`seo.agent.md`)

**Rôle** : Expert SEO - Référencement Naturel pour SaaS B2B Français

**Responsabilité unique** :

- ✅ Métadonnées Next.js (`export const metadata`)
- ✅ Contenu optimisé pages marketing (français)
- ✅ Schema.org (FAQPage, SoftwareApplication)
- ✅ FAQ SEO structurée
- ✅ Maillage interne et sitemap

**Exemple** :

```
@seo Optimiser la page pricing pour le mot-clé
"logiciel devis institut beauté"
```

---

## 📊 MATRICE DE DÉCISION RAPIDE

### Quelle Question → Quel Agent ?

| Demande Développeur                                         | Agent Principal     | Agents Collaborateurs                |
| ----------------------------------------------------------- | ------------------- | ------------------------------------ |
| Créer une nouvelle page dashboard                           | ARCHITECTURE_NEXTJS | → DATA_SECURITY (actions)            |
| Créer/modifier une Server Action                            | DATA_SECURITY       | —                                    |
| Ajouter un champ au schema Prisma                           | DATABASE_PRISMA     | → DATA_SECURITY (sync Zod)           |
| Optimiser une query Prisma lente                            | DATABASE_PRISMA     | —                                    |
| Créer un composant réutilisable (2+ features)               | UX_UI               | —                                    |
| Page lente : UI + DB                                        | **ORCHESTRATEUR**   | → ARCHITECTURE + DATABASE_PRISMA     |
| Intégrer Stripe checkout                                    | PAYMENTS            | → DATA_SECURITY (validation webhook) |
| Corriger une fuite de données multi-tenant                  | DATA_SECURITY       | —                                    |
| Configurer Sentry error tracking                            | MONITORING          | → DATA_SECURITY (wrapping actions)   |
| Créer tests E2E pour flow de devis                          | TESTING             | —                                    |
| Améliorer accessibilité formulaire                          | UX_UI               | —                                    |
| Optimiser SEO page pricing                                  | SEO                 | —                                    |
| Décider colocation composant (\_components/ vs /components) | ARCHITECTURE_NEXTJS | → UX_UI si réutilisable              |
| Ajouter validation Zod sur formulaire                       | DATA_SECURITY       | —                                    |
| Problème de N+1 queries                                     | DATABASE_PRISMA     | —                                    |

### Indicateurs pour ORCHESTRATEUR

Activer l'**ORCHESTRATEUR** quand :

- ✅ La demande touche **3+ domaines** différents
- ✅ Besoin d'une **vue d'ensemble** avant d'agir
- ✅ Risque de **conflit** entre agents (ex: qui optimise quoi ?)
- ✅ Problème **multi-couches** (UI + DB + sécurité)

**Exemples** :

- "Optimiser le dashboard qui charge en 5s" → UI (streaming) + DB (N+1) + UX (skeletons)
- "Ajouter système de notifications email" → Architecture (routing) + Security (actions) + Integrations (SendGrid)

---

## 🚀 Workflows Recommandés

### Workflow 1 : Nouvelle Fonctionnalité Complète

**Demande** : "Ajouter un système de remises sur les devis"

```
1. @orchestrateur Analyser la demande
   → Plan : Schema DB, Validation, UI, Tests

2. @database-prisma Créer modèle Discount + migration

3. @data-security Créer schéma Zod + Server Actions
   - applyDiscount(quoteId, discountPercent)
   - removeDiscount(quoteId)

4. @architecture-nextjs Intégrer dans UI devis
   - Formulaire application remise
   - Affichage prix réduit

5. @testing Tests pour logique remise
   - Validation pourcentage (0-100)
   - Multi-tenancy (ownership quote)
```

### Workflow 2 : Bug de Sécurité

**Symptôme** : "Les clients d'un salon apparaissent chez un autre"

```
1. @data-security Analyser Server Action getClients()
   → Détection : businessId filter manquant

2. Fix immédiat :
   ✅ Ajouter where: { businessId: session.user.businessId }

3. @testing Créer test de régression
   - Vérifier isolation multi-tenant
```

### Workflow 3 : Optimisation Performance

**Symptôme** : "Page /dashboard/devis lente (3s de chargement)"

```
1. @orchestrateur Analyse multi-couches

2. @database-prisma Optimiser queries
   - Index sur businessId + createdAt
   - Pagination cursor-based
   - Select limité aux champs nécessaires

3. @architecture-nextjs Implémenter streaming
   - Suspense boundary
   - loading.tsx avec skeleton

4. @ux-ui Créer skeleton screens
   - QuotesListSkeleton réutilisable
```

---

## 🎓 Guide de Délégation

### Comment Savoir Si Je Dois Déléguer ?

Chaque agent a une section **"🚦 CHECKLIST : DOIS-JE DÉLÉGUER ?"** avec :

#### Exemple dans ARCHITECTURE_NEXTJS

```markdown
- [ ] Besoin de créer une **Server Action** (mutation) ? → DATA_SECURITY
- [ ] Besoin de **validation Zod** ? → DATA_SECURITY
- [ ] Besoin de modifier le **schema Prisma** ? → DATABASE_PRISMA
- [ ] Query Prisma **lente** ? → DATABASE_PRISMA
```

#### Exemple dans DATA_SECURITY

```markdown
- [ ] Besoin de **modifier le schema** Prisma ? → DATABASE_PRISMA
- [ ] Query Prisma **lente** (performance) ? → DATABASE_PRISMA
- [ ] Besoin de créer une **route Next.js** ? → ARCHITECTURE_NEXTJS
- [ ] Problème **multi-couches** ? → ORCHESTRATEUR
```

### Phrases de Délégation Standardisées

Dans chaque agent :

> "Pour [action spécifique], consultez l'agent **[NOM_AGENT]** qui gère [responsabilité]."

**Exemples** :

- "Pour créer la Server Action sécurisée, consultez l'agent **DATA_SECURITY**."
- "Pour optimiser cette query, consultez l'agent **DATABASE_PRISMA**."
- "Pour créer ce composant réutilisable, consultez l'agent **UX_UI**."

---

## 🔧 Contexte Technique Solkant

### Stack

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript (strict mode)
- **Database** : PostgreSQL (Neon) + Prisma ORM
- **Auth** : NextAuth v4 (JWT strategy)
- **Paiements** : Stripe (abonnements freemium)
- **Monitoring** : Sentry
- **Styling** : Tailwind CSS v4

### Architecture Multi-Tenant

```
User (NextAuth) → Business (1:1) ← PIVOT CENTRAL
                       ↓
    ┌──────────────────┼──────────────────┐
    ↓                  ↓                  ↓
  Client            Service            Quote
 (1:many)          (1:many)           (1:many)
```

**RÈGLE D'OR** : Toute requête Prisma DOIT filtrer par `businessId`

### Domaine Métier

- **Business** : Salon de beauté (1 par utilisateur)
- **Client** : Client du salon
- **Service** : Prestation de beauté (coupe, coloration, etc.)
- **Quote** : Devis avec items (lignes de services)

## ⚡ Exemples Concrets

### Exemple 1 : Créer une fonctionnalité complète

**Demande** : "Ajouter un système de commentaires sur les devis"

**Orchestration** :

```
@orchestrateur Ajouter un système de commentaires sur les devis
```

**Réponse attendue** :

```
📋 ANALYSE
- Domaine : Gestion de devis (quotes)
- Impact : DATA_SECURITY (modèle Comment) + ARCHITECTURE_NEXTJS (UI)

🎯 PLAN D'ACTION
Étape 1 – [Agent DATA_SECURITY]
  - Créer modèle Comment avec businessId + relation Quote
  - Migration Prisma + validation Zod

Étape 2 – [Agent ARCHITECTURE_NEXTJS]
  - Composant CommentsList + CommentForm
  - Server Action createComment()

Étape 3 – [Agent DATA_SECURITY]
  - Vérifier filtrage businessId
```

### Exemple 2 : Debug de sécurité

**Demande** : "Mes clients apparaissent chez tous les salons"

```
@data-security Dans mon Server Action getClients(),
j'ai : return await prisma.client.findMany();
Pourquoi je vois les clients d'autres salons ?
```

**Réponse attendue** :

```
🚨 VULNÉRABILITÉ CRITIQUE DÉTECTÉE

Votre code manque le filtrage `businessId`.

❌ Code actuel (DANGEREUX) :
return await prisma.client.findMany();

✅ Correction :
const session = await getServerSession(authOptions);
return await prisma.client.findMany({
  where: { businessId: session.user.businessId }
});

[Explications détaillées...]
```

### Exemple 3 : Optimisation

```
@architecture-nextjs Ma page /dashboard/devis prend 5 secondes
à charger avec 1000 devis. Comment optimiser ?
```

**Réponse attendue** :

```
🚀 STRATÉGIES D'OPTIMISATION

1. Pagination côté serveur (Prisma)
2. Select partiel (uniquement champs nécessaires)
3. Streaming avec Suspense
4. Virtualisation (react-window si liste longue)

[Code détaillé pour chaque solution...]
```

## 🎓 Best Practices

### 1. Poser des questions contextualisées

❌ **Mauvais** : "Comment créer une page ?"

✅ **Bon** : "@architecture-nextjs Comment créer une page dashboard pour afficher les statistiques mensuelles des devis avec Server Components ?"

### 2. Inclure le code problématique

❌ **Mauvais** : "Mon webhook ne fonctionne pas"

✅ **Bon** :

```
@saas-integrations Mon webhook Stripe retourne 400.
Voici mon code :

export async function POST(req: NextRequest) {
  const body = await req.json();
  // ...
}
```

### 3. Préciser le contexte métier

❌ **Mauvais** : "Ajouter un champ"

✅ **Bon** : "Ajouter un champ `discount` (remise) au modèle Quote pour permettre aux salons d'appliquer une réduction en pourcentage"

## 🔍 Dépannage

### "L'agent ne trouve pas mon contexte"

**Solution** : Inclure le code ou le chemin du fichier dans la question

```
@data-security Dans app/actions/clients.ts,
ma fonction createClient() ne valide pas l'email
```

### "L'agent propose du code obsolète"

**Solution** : Préciser la version de Next.js

```
@architecture-nextjs [Next.js 16] Comment utiliser params
dans une route dynamique ?
```

### "Je ne sais pas quel agent utiliser"

**Solution** : Commencer par l'orchestrateur

```
@orchestrateur [Description de votre problème/demande]
```

→ Il vous dira quel agent spécialisé consulter

---

## 💡 Cas d'Usage Réels du Projet Solkant

### Scénario 1 : Ajouter une fonctionnalité "Notes internes" sur les devis

**Question** :

```text
@orchestrateur Je veux ajouter des notes internes sur les devis
(visibles uniquement par le salon, pas sur le PDF client)
```

**Workflow attendu** :

1. Orchestrateur identifie : DATA_SECURITY + ARCHITECTURE_NEXTJS
2. @data-security : Ajouter champ `internalNotes` au modèle Quote
3. @architecture-nextjs : Créer `InternalNotesField` dans QuoteForm
4. @data-security : Vérifier que le champ n'apparaît pas dans QuotePDF

---

### Scénario 2 : Mon webhook Stripe échoue en production

**Question** :

```text
@saas-integrations Mon webhook Stripe retourne "Invalid signature"
en production mais fonctionne en local avec Stripe CLI
```

**Réponse attendue** :

- Vérifier STRIPE_WEBHOOK_SECRET différent entre dev/prod
- Vérifier que `req.text()` est utilisé (pas `req.json()`)
- Checker Vercel logs pour voir le body reçu
- Confirmer que webhook endpoint est en HTTPS

---

### Scénario 3 : Les clients d'un salon apparaissent chez un autre

**Question** :

```text
@data-security URGENT : Un salon voit les clients d'un autre salon !
Voici mon code getClients() : [copier le code]
```

**Réponse attendue** :

- 🚨 Détection immédiate du filtre `businessId` manquant
- Code corrigé avec filtrage
- Vérification des autres Server Actions
- Recommandation d'audit complet avec script de vérification

---

### Scénario 4 : Optimiser la page devis qui devient lente

**Question** :

```text
@architecture-nextjs Ma page /dashboard/devis prend 5 secondes
avec 500+ devis. Comment paginer efficacement ?
```

**Réponse attendue** :

- Pattern pagination Prisma avec `skip` et `take`
- Streaming avec `<Suspense>` pour le tableau
- Select partiel (uniquement champs nécessaires)
- Code exemple complet avec Server Component + Client Component

---

### Scénario 5 : Rendre le formulaire client accessible

**Question** :

```text
@ux-ui Mon formulaire ClientForm n'est pas accessible au clavier
et le lecteur d'écran ne lit pas les erreurs
```

**Réponse attendue** :

- Ajouter labels avec `htmlFor`
- Utiliser `aria-invalid` et `aria-describedby` pour les erreurs
- Implémenter `FormField` wrapper avec rôles ARIA
- Ajouter `role="alert"` pour les messages d'erreur

---

### Scénario 6 : Setup tests pour les Server Actions

**Question** :

```text
@testing Comment tester ma Server Action createClient()
pour vérifier que le filtrage businessId fonctionne ?
```

**Réponse attendue** :

- Setup Vitest + mocks pour NextAuth et Prisma
- Template de test avec 3 cas : success, auth failed, businessId check
- Pattern pour vérifier que Prisma est appelé avec le bon `where`
- Exemple de test qui échoue si businessId manquant

---

### Scénario 7 : Optimiser le SEO de la page pricing

**Question** :

```text
@seo Comment optimiser /pricing pour "logiciel devis institut beauté" ?
```

**Réponse attendue** :

- Métadonnées optimisées avec mot-clé cible
- Structure H1/H2/H3 avec mots-clés naturels
- FAQ schema.org pour questions fréquentes
- Call-to-action optimisé avec texte descriptif

---

### Scénario 8 : Ajouter l'envoi d'email lors de création devis

**Question** :

```text
@orchestrateur Je veux envoyer un email au client
quand un devis est créé avec un lien de consultation
```

**Workflow attendu** :

1. Orchestrateur : SAAS_INTEGRATIONS (email) + DATA_SECURITY (token sécurisé)
2. @saas-integrations : Setup SendGrid/Resend + template email
3. @data-security : Créer token sécurisé pour lien consultation
4. @architecture-nextjs : Page publique `/devis/[token]` pour consulter

---

## 📖 Documentation Complémentaire

- [Configuration Partagée](./_shared-config.md) - Variables d'env, conventions
- [Audit de Cohérence](./COHERENCE_AUDIT.md) - Vérification agents vs code
- [Architecture Solkant](../../copilot-instructions.md)
- [Stripe Integration](../../STRIPE_INTEGRATION.md)
- [Sentry Setup](../../docs/SENTRY_SETUP.md)
- [Accessibilité](../../docs/ACCESSIBILITY.md)

## 🤝 Contribution

Pour améliorer les agents :

1. Modifier le fichier `.agent.md` concerné
2. Tester avec des questions variées
3. Commit avec message descriptif

Voir [CONTRIBUTING_AGENTS.md](./CONTRIBUTING_AGENTS.md) pour le guide complet.

---

**Note** : Ces agents sont des guides experts, pas des remplacements de la réflexion. Toujours valider les suggestions et tester en local avant de commit.
