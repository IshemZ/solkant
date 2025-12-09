# 🤖 Agents Copilot - Solkant

Documentation des agents spécialisés pour le développement de Solkant.

## 📋 Vue d'ensemble

Ce dossier contient **9 agents Copilot spécialisés** conçus pour orchestrer le développement de Solkant de manière experte et structurée. Chaque agent couvre un domaine spécifique du stack technique.

> **Configuration Partagée** : Consultez [\_shared-config.md](./_shared-config.md) pour les configurations communes (variables d'env, commandes Prisma, patterns réutilisables).

---

## 🎯 Les 9 Agents

### 1. 🎭 **ORCHESTRATEUR** (`orchestrateur.agent.md`)

**Rôle** : Chef d'orchestre multi-agents

**Quand l'utiliser** :

- Demandes complexes nécessitant plusieurs domaines d'expertise
- Besoin d'une vue d'ensemble avant d'agir
- Coordonner plusieurs modifications inter-dépendantes

**Ce qu'il fait** :

- Analyse la demande et identifie les domaines impactés
- Crée un plan d'action structuré
- Active les agents spécialisés au bon moment
- Fournit une checklist de vérification finale

**Exemple d'utilisation** :

```
@orchestrateur Je veux ajouter un système de notifications
par email quand un devis est accepté
```

---

### 2. 🏗️ **ARCHITECTURE_NEXTJS** (`architecture-nextjs.agent.md`)

**Rôle** : Expert App Router, Server Components, performance

**Quand l'utiliser** :

- Créer/modifier des routes Next.js
- Optimiser les performances (streaming, Suspense)
- Questions sur Server Actions vs API Routes
- Organisation des composants (colocation)
- Problèmes TypeScript/Next.js

**Ce qu'il fait** :

- Guide sur les patterns Next.js 16 modernes
- Optimise la structure de code
- Résout les problèmes de Server/Client Components
- Applique les meilleures pratiques App Router

**Exemple d'utilisation** :

```
@architecture-nextjs Comment implémenter du streaming
pour une liste de devis avec 1000+ entrées ?
```

---

### 3. 🔒 **DATA_SECURITY** (`data-security.agent.md`)

**Rôle** : Expert sécurité multi-tenant, validation Zod, Server Actions sécurisées

**Quand l'utiliser** :

- Créer/modifier des Server Actions avec validation
- Questions de sécurité multi-tenant
- Validation Zod (schemas, messages français)
- Problèmes d'isolation de données
- Guards d'accès, ownership checks
- NextAuth JWT customization

**Ce qu'il fait** :

- Vérifie que CHAQUE requête filtre par `businessId` (CRITIQUE)
- Crée des validations Zod robustes avec messages français
- Sécurise les Server Actions (auth, validation, ownership)
- Gère les sessions NextAuth JWT

**Exemple d'utilisation** :

```
@data-security J'ai une fuite de données : les clients
d'un business apparaissent chez un autre salon
```

**Délègue à DATABASE_PRISMA** : Schema Prisma, migrations, optimisation DB

---

### 4. 💳 **PAYMENTS** (`payments.agent.md`)

**Rôle** : Expert Stripe (abonnements, checkout, webhooks)

**Quand l'utiliser** :

- Intégrer Stripe checkout
- Gérer abonnements freemium (trial 30j → 9,99€/mois)
- Configurer webhooks Stripe
- Customer portal
- Problèmes de paiement

**Ce qu'il fait** :

- Configure Stripe checkout sessions
- Gère webhooks (signature verification, idempotence)
- Implémente guards accès PRO
- Synchronise statuts abonnement avec DB

**Exemple d'utilisation** :

```
@payments Comment implémenter une période d'essai de 30 jours
avec transition automatique vers abonnement payant ?
```

---

### 5. 🔍 **MONITORING** (`monitoring.agent.md`)

**Rôle** : Expert Sentry, Google Analytics, logging, observabilité

**Quand l'utiliser** :

- Configurer Sentry error tracking
- Ajouter Google Analytics events
- Déboguer erreurs en production
- Performance monitoring
- Alertes et notifications

**Ce qu'il fait** :

- Configure Sentry (server/client/edge)
- Capture erreurs avec contexte (tags, breadcrumbs)
- Implémente Google Analytics 4
- Crée dashboards et alertes

**Exemple d'utilisation** :

```
@monitoring Comment tracker les conversions (sign-up, subscription)
et capturer les erreurs Stripe avec contexte métier ?
```

---

### 6. 🧪 **TESTING** (`testing.agent.md`)

**Rôle** : Expert Vitest, Testing Library, Playwright, qualité

**Quand l'utiliser** :

- Intégration/debug Stripe (abonnements)
- Configuration Sentry (monitoring)
- Problèmes OAuth Google
- Webhooks (signature, idempotency)
- Accessibilité (WCAG, A11y)
- RGPD/cookies

**Ce qu'il fait** :

- Configure les intégrations SaaS
- Debug les webhooks Stripe
- Résout les problèmes OAuth
- Garantit la conformité WCAG 2.1 AA

**Exemple d'utilisation** :

```text
@saas-integrations Mon webhook Stripe renvoie une erreur
"Invalid signature" en production
```

---

### 5. 🧪 **TESTING** (`testing.agent.md`)

**Rôle** : Expert testing React/Next.js, garantie qualité

**Quand l'utiliser** :

- Setup environnement de tests (Vitest, Playwright)
- Écrire tests pour Server Actions
- Tests de composants React
- Validation des schémas Zod
- Tests E2E
- Améliorer la couverture de code

**Ce qu'il fait** :

- Configure stack de tests (Vitest + Testing Library)
- Crée tests unitaires et d'intégration
- Patterns de mock pour Prisma/NextAuth
- Guide sur les tests de sécurité multi-tenant
- Setup CI/CD pour tests automatiques

**Exemple d'utilisation** :

```text
@testing Comment tester ma Server Action createClient()
pour vérifier le filtrage businessId ?
```

---

### 6. 🎨 **UX_UI** (`ux-ui.agent.md`)

**Rôle** : Expert design systems, accessibilité, composants réutilisables

**Quand l'utiliser** :

- Setup shadcn/ui et design system
- Créer composants UI accessibles
- Loading states et skeleton screens
- Formulaires avec validation visuelle
- Audit accessibilité WCAG 2.1 AA
- Responsive design
- Empty states et feedback utilisateur

**Ce qu'il fait** :

- Guide sur l'installation et configuration shadcn/ui
- Crée composants accessibles (A11y)
- Implémente loading.tsx pour toutes les routes
- Patterns UX pour SaaS (toasts, confirmations, etc.)
- Audit contraste, navigation clavier, screen readers

**Exemple d'utilisation** :

```text
@ux-ui Comment créer un formulaire accessible
avec shadcn/ui et validation en temps réel ?
```

---

### 7. 📈 **SEO** (`seo.agent.md`)

**Rôle** : Expert SEO pour SaaS B2B français

**Quand l'utiliser** :

- Optimiser métadonnées pages marketing
- Structurer contenu SEO (H1, H2, H3)
- Créer FAQ avec schema.org
- Améliorer référencement naturel
- Rédiger contenu optimisé en français
- Configurer sitemap et robots.txt

**Ce qu'il fait** :

- Optimise `metadata` Next.js pour SEO
- Crée contenu ciblé (instituts de beauté)
- Génère JSON-LD pour FAQPage, SoftwareApplication
- Guide sur le maillage interne
- Stratégies de mots-clés longue traîne

**Exemple d'utilisation** :

```text
@seo Comment optimiser la page pricing pour le mot-clé
"logiciel devis institut beauté" ?
```

---

## 🚀 Comment utiliser les agents

### Syntaxe dans GitHub Copilot Chat

```text
@nom-agent Votre question ou demande
```

### Workflows recommandés

#### Workflow 1 : Nouvelle fonctionnalité complète

1. **@orchestrateur** : "Je veux ajouter un système de remises sur les devis"

   - Il analyse et crée un plan
   - Il identifie : DATA_SECURITY (schema), ARCHITECTURE_NEXTJS (UI), SAAS_INTEGRATIONS (si facturation)

2. **@data-security** : "Créer le modèle Discount avec relation Quote"

   - Migration Prisma
   - Validation Zod

3. **@architecture-nextjs** : "Créer l'UI pour appliquer une remise"
   - Composant `DiscountForm`
   - Server Action

#### Workflow 2 : Bug de sécurité

```text
@data-security J'ai ce code dans getClients() :
const clients = await prisma.client.findMany();
Est-ce sécurisé ?
```

→ L'agent détectera immédiatement le problème de filtrage `businessId` manquant

#### Workflow 3 : Optimisation performance

```text
@architecture-nextjs Ma page /dashboard/devis est lente
avec 500+ devis. Comment optimiser ?
```

→ L'agent proposera : streaming, pagination, select partiel Prisma

#### Workflow 4 : Intégration externe

```text
@saas-integrations Comment ajouter l'envoi d'emails
via SendGrid quand un devis est créé ?
```

→ L'agent guidera l'intégration webhook-safe et RGPD-compliant

---

## 📚 Cheat Sheet : Quel agent pour quelle question ?

| Question                                      | Agent                  |
| --------------------------------------------- | ---------------------- |
| "Comment créer une nouvelle page dashboard ?" | `@architecture-nextjs` |
| "Ajouter un champ au modèle Client"           | `@data-security`       |
| "Corriger une fuite de données entre salons"  | `@data-security`       |
| "Intégrer Stripe pour la facturation"         | `@saas-integrations`   |
| "Mon webhook Stripe ne fonctionne pas"        | `@saas-integrations`   |
| "Optimiser le chargement de la page"          | `@architecture-nextjs` |
| "Sécuriser un endpoint d'API"                 | `@data-security`       |
| "Configurer Google Analytics"                 | `@saas-integrations`   |
| "Tâche complexe avec plusieurs aspects"       | `@orchestrateur`       |
| "Rendre mon formulaire accessible"            | `@ux-ui`               |
| "Server Component vs Client Component ?"      | `@architecture-nextjs` |
| "Migration Prisma sécurisée"                  | `@data-security`       |
| "Setup tests pour Server Actions"             | `@testing`             |
| "Créer loading states et skeletons"           | `@ux-ui`               |
| "Optimiser métadonnées pour SEO"              | `@seo`                 |
| "Audit accessibilité WCAG"                    | `@ux-ui`               |
| "Tester sécurité multi-tenant"                | `@testing`             |
| "Rédiger FAQ optimisée pour le référencement" | `@seo`                 |
| "Installer et configurer shadcn/ui"           | `@ux-ui`               |
| "Tests E2E avec Playwright"                   | `@testing`             |

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
