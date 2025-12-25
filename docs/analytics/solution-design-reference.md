# 🔧 Solution Design Reference (SDR) - Solkant

**Version** : 1.0
**Date de création** : 2025-12-25
**Dernière mise à jour** : 2025-12-25
**Plateforme** : Web (Next.js 16 App Router)
**Outil Analytics** : Google Analytics 4

---

## Table des Matières

1. [Vue d'Ensemble et Conventions](#1-vue-densemble-et-conventions)
2. [Événements de Conversion](#2-événements-de-conversion)
3. [Événements de Support](#3-événements-de-support)
4. [Data Layer Mapping](#4-data-layer-mapping)
5. [Configuration GA4 et Maintenance](#5-configuration-ga4-et-maintenance)

---

## 1. Vue d'Ensemble et Conventions

### 1.1 Document Metadata

| Propriété | Valeur |
|-----------|--------|
| **Projet** | Solkant - SaaS Gestion Devis |
| **Plateforme** | Web (Next.js 16 App Router) |
| **Outil Analytics** | Google Analytics 4 |
| **GA4 Measurement ID** | `NEXT_PUBLIC_GA_MEASUREMENT_ID` (variable d'environnement) |
| **Périmètre** | Acquisition SEO + Inscription utilisateur |

### 1.2 Architecture Technique

**Stack tracking :**
- **Client-side** : `@next/third-parties/google` (GoogleAnalytics component)
- **Data Layer** : `window.gtag()` (API GA4 standard)
- **Server Actions** : Next.js Server Actions (`app/actions/*.ts`)
- **Consent Management** : `window.gtag("consent", "update")` via CookieBanner

**Environnements de tracking :**
- **Production** : GA4 activé (NEXT_PUBLIC_GA_MEASUREMENT_ID défini)
- **Développement** : GA4 désactivé (recommandé pour éviter pollution données)
- **Test** : GA4 désactivé (pas de tracking dans Vitest/Playwright)

### 1.3 Conventions de Nommage

**Événements :**
- Format : `snake_case` (ex: `sign_up`, `click_cta_register`)
- Limite : 40 caractères maximum

**Paramètres :**
- Format : `snake_case`
- Types autorisés : `string`, `number`, `boolean`
- Limite : 100 caractères pour valeurs string

**Valeurs énumérées :**
- Format : `snake_case` ou `kebab-case`
- Exemples : `"credentials"`, `"google"`, `"email_exists"`

### 1.4 User ID Tracking

**Configuration :**
- **Propriété GA4** : User ID activé (Settings → Data Collection)
- **Identifiant** : `businessId` (depuis session NextAuth)
- **Timing** : Envoyé dès connexion + à chaque page_view si authentifié

**Code :**
```typescript
// Après connexion réussie
if (session?.user?.businessId) {
  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: session.user.businessId
  });
}
```

### 1.5 Consent Mode (RGPD)

**État par défaut :**
```javascript
gtag('consent', 'default', {
  'analytics_storage': 'denied'
});
```

**Après acceptation cookies :**
```javascript
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
```

### 1.6 Tableau Récapitulatif des Événements

| # | Nom Événement | Type | Priorité | Conversion GA4 | Environnement |
|---|--------------|------|----------|----------------|---------------|
| 1 | `sign_up` | Standard GA4 | ⭐⭐⭐ Critique | ✅ Oui (primaire) | Client + Server |
| 2 | `form_submit_contact` | Custom | ⭐⭐ Moyenne | ✅ Oui (secondaire) | Client |
| 3 | `trial_started` | Custom | ⭐ Basse | Optionnel | Server |
| 4 | `click_cta_register` | Custom | ⭐⭐ Moyenne | ❌ Non | Client |
| 5 | `form_start_register` | Custom | ⭐⭐ Moyenne | ❌ Non | Client |
| 6 | `oauth_button_click` | Custom | ⭐⭐ Moyenne | ❌ Non | Client |
| 7 | `sign_up_error` | Custom | ⭐⭐⭐ Critique | ❌ Non | Client + Server |
| 8 | `page_view` | Standard GA4 | ⭐⭐⭐ Critique | ❌ Non | Auto (enrichi) |

---

## 2. Événements de Conversion

### 2.1 Événement #1 : `sign_up` ⭐⭐⭐ CRITIQUE

**Description :**
Déclenché lorsqu'un utilisateur crée avec succès un compte (User + Business créés en base de données).

**Type :** Standard GA4 (événement recommandé pour inscriptions)

**Déclencheur :**
- **Timing** : Immédiatement après création réussie en DB
- **Conditions** : User créé AND Business créé AND pas d'erreur serveur
- **Fréquence** : Une seule fois par utilisateur

**Emplacements code :**

1. **Inscription credentials (email/password)**
   - Fichier : `app/actions/auth.ts`
   - Fonction : `register()`
   - Position : Après succès Prisma `user.create()` + `business.create()`

2. **Inscription Google OAuth**
   - Fichier : `lib/auth.ts`
   - Callback : `signIn()` callback NextAuth
   - Position : Après création auto du Business

**Paramètres :**

| Paramètre | Type | Obligatoire | Valeurs possibles | Description |
|-----------|------|-------------|-------------------|-------------|
| `method` | string | ✅ Oui | `"credentials"` \| `"google"` | Méthode d'inscription utilisée |
| `user_id` | string | ✅ Oui | businessId (format CUID) | Identifiant unique pour User ID tracking |
| `value` | number | ❌ Non | LTV estimé (ex: 50) | Valeur conversion en euros (optionnel) |
| `currency` | string | ❌ Non | `"EUR"` | Devise (si value défini) |

**Implémentation - Composant Client :**

```typescript
// app/auth/register/page.tsx (composant client)
"use client";

async function handleSubmit() {
  const result = await register(formData);

  if (result.data?.trackSignUp && window.gtag) {
    window.gtag("event", "sign_up", {
      method: result.data.method, // "credentials"
      user_id: result.data.business.id
    });
  }

  router.push("/dashboard");
}
```

**Validation post-déploiement :**
1. GA4 Realtime : Vérifier événement `sign_up` apparaît
2. DebugView : Valider paramètres `method` et `user_id` présents
3. Event Count : Comparer COUNT(sign_up) vs COUNT(User) en DB

**Notes critiques :**
- ⚠️ NE PAS tracker `sign_up` lors du simple clic sur "S'inscrire"
- ⚠️ Gérer le tracking côté client (Server Actions ne peuvent pas appeler window.gtag)
- ⚠️ Éviter double tracking : utiliser flag sessionStorage
- ⚠️ User ID doit être `businessId` (pas `userId`)

---

### 2.2 Événement #2 : `form_submit_contact` ⭐⭐ MOYENNE

**Description :**
Déclenché lors de la soumission réussie du formulaire de contact.

**Type :** Custom

**Déclencheur :**
- **Page** : `/contact`
- **Timing** : Après envoi réussi du formulaire
- **Conditions** : Validation Zod passée + pas d'erreur serveur

**Paramètres :**

| Paramètre | Type | Obligatoire | Valeurs possibles | Description |
|-----------|------|-------------|-------------------|-------------|
| `form_name` | string | ✅ Oui | `"contact"` | Nom du formulaire (fixe) |
| `form_location` | string | ✅ Oui | URL de la page | Page d'où vient le submit |
| `user_type` | string | ❌ Non | `"authenticated"` \| `"anonymous"` | Si connecté ou non |

**Implémentation :**

```typescript
// app/(marketing)/contact/page.tsx
"use client";

async function handleSubmit(e: FormEvent) {
  e.preventDefault();

  const result = await submitContactForm(formData);

  if (result.success && window.gtag) {
    window.gtag("event", "form_submit_contact", {
      form_name: "contact",
      form_location: window.location.href,
      user_type: session ? "authenticated" : "anonymous"
    });
  }
}
```

---

### 2.3 Événement #3 : `trial_started` ⭐ BASSE (OPTIONNEL)

**Description :**
Déclenché lors de la première connexion après inscription.

**Type :** Custom

**Paramètres :**

| Paramètre | Type | Obligatoire | Valeurs possibles | Description |
|-----------|------|-------------|-------------------|-------------|
| `subscription_status` | string | ✅ Oui | `"TRIAL"` | Statut abonnement |
| `user_id` | string | ✅ Oui | businessId | Identifiant unique |

**Note :** Optionnel en Phase 1. Utile en Phase 2 pour mesurer l'activation réelle.

---

## 3. Événements de Support

### 3.1 Événement #4 : `click_cta_register` ⭐⭐ MOYENNE

**Description :**
Déclenché lors du clic sur n'importe quel CTA menant vers l'inscription.

**Paramètres :**

| Paramètre | Type | Obligatoire | Valeurs possibles |
|-----------|------|-------------|-------------------|
| `cta_location` | string | ✅ Oui | `"hero"` \| `"navbar"` \| `"footer"` \| `"pricing_card"` \| `"blog_inline"` \| `"features_section"` |
| `cta_text` | string | ✅ Oui | Texte du bouton |
| `page_path` | string | ✅ Oui | URL de la page |
| `cta_type` | string | ❌ Non | `"button"` \| `"link"` |

**Implémentation - Composant réutilisable :**

```typescript
// components/shared/CTARegisterButton.tsx
"use client";

interface CTARegisterButtonProps {
  location: "hero" | "navbar" | "footer" | "pricing_card" | "blog_inline" | "features_section";
  text: string;
  className?: string;
  variant?: "button" | "link";
}

export function CTARegisterButton({ location, text, className, variant = "button" }: CTARegisterButtonProps) {
  const handleClick = () => {
    if (window.gtag) {
      window.gtag("event", "click_cta_register", {
        cta_location: location,
        cta_text: text,
        page_path: window.location.pathname,
        cta_type: variant
      });
    }
  };

  return (
    <Link href="/auth/register" onClick={handleClick} className={className}>
      {text}
    </Link>
  );
}
```

---

### 3.2 Événement #5 : `form_start_register` ⭐⭐ MOYENNE

**Description :**
Déclenché lorsque l'utilisateur commence à remplir le formulaire d'inscription.

**Paramètres :**

| Paramètre | Type | Obligatoire | Valeurs possibles |
|-----------|------|-------------|-------------------|
| `first_field` | string | ✅ Oui | `"email"` \| `"name"` \| `"password"` |
| `referrer` | string | ❌ Non | URL précédente |

**Implémentation :**

```typescript
// app/auth/register/page.tsx
const [formStartTracked, setFormStartTracked] = useState(false);

const trackFormStart = (fieldName: string) => {
  if (!formStartTracked && window.gtag) {
    window.gtag("event", "form_start_register", {
      first_field: fieldName,
      referrer: document.referrer || "direct"
    });
    setFormStartTracked(true);
  }
};
```

---

### 3.3 Événement #6 : `oauth_button_click` ⭐⭐ MOYENNE

**Description :**
Déclenché lors du clic sur "Continuer avec Google".

**Paramètres :**

| Paramètre | Type | Obligatoire | Valeurs possibles |
|-----------|------|-------------|-------------------|
| `provider` | string | ✅ Oui | `"google"` |
| `page_type` | string | ✅ Oui | `"register"` \| `"login"` |

**Implémentation :**

```typescript
const handleGoogleSignIn = () => {
  if (window.gtag) {
    window.gtag("event", "oauth_button_click", {
      provider: "google",
      page_type: "register"
    });
  }

  sessionStorage.setItem("new_signup", "google");
  signIn("google", { callbackUrl: "/dashboard" });
};
```

---

### 3.4 Événement #7 : `sign_up_error` ⭐⭐⭐ CRITIQUE

**Description :**
Déclenché lorsqu'une tentative d'inscription échoue.

**Paramètres :**

| Paramètre | Type | Obligatoire | Valeurs possibles |
|-----------|------|-------------|-------------------|
| `error_type` | string | ✅ Oui | `"email_exists"` \| `"validation_failed"` \| `"server_error"` \| `"oauth_failed"` |
| `method` | string | ✅ Oui | `"credentials"` \| `"google"` |
| `error_message` | string | ❌ Non | Message d'erreur (sanitisé, max 100 char) |
| `field_name` | string | ❌ Non | `"email"` \| `"password"` \| `"name"` |

**Implémentation :**

```typescript
const result = await register(formData);

if (result.error) {
  let errorType = "server_error";

  if (result.error.includes("déjà utilisé")) {
    errorType = "email_exists";
  } else if (result.error.includes("validation")) {
    errorType = "validation_failed";
  }

  if (window.gtag) {
    window.gtag("event", "sign_up_error", {
      error_type: errorType,
      method: "credentials",
      error_message: result.error.substring(0, 100)
    });
  }
}
```

---

### 3.5 Événement #8 : `page_view` (Enrichi) ⭐⭐⭐ CRITIQUE

**Description :**
Événement standard GA4 automatique, enrichi avec paramètres custom.

**Paramètres custom :**

| Paramètre | Type | Obligatoire | Valeurs possibles |
|-----------|------|-------------|-------------------|
| `page_category` | string | ✅ Oui | `"marketing"` \| `"blog"` \| `"legal"` \| `"dashboard"` \| `"auth"` |
| `user_authenticated` | boolean | ✅ Oui | `true` \| `false` |
| `subscription_status` | string | ❌ Non | `"TRIAL"` \| `"ACTIVE"` \| `"CANCELED"` \| `null` |
| `content_type` | string | ❌ Non | `"article"` \| `"guide"` \| `"landing_page"` |

**Implémentation :**

```typescript
// components/analytics/PageViewTracker.tsx
"use client";

export function PageViewTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (window.gtag) {
      let pageCategory = "marketing";
      if (pathname.startsWith("/blog")) pageCategory = "blog";
      else if (pathname.startsWith("/dashboard")) pageCategory = "dashboard";
      else if (pathname.startsWith("/auth")) pageCategory = "auth";

      window.gtag("event", "page_view", {
        page_category: pageCategory,
        user_authenticated: !!session,
        subscription_status: session?.user?.subscriptionStatus || null
      });
    }
  }, [pathname, session]);

  return null;
}
```

---

## 4. Data Layer Mapping

### 4.1 Architecture Data Layer

GA4 utilise directement `window.gtag()` comme data layer. L'architecture est :

```
User Action (Client)
    ↓
Server Action (Next.js)
    ↓
Database Update (Prisma)
    ↓
Return Success/Error to Client
    ↓
Client Component triggers window.gtag()
    ↓
GA4 Measurement Protocol
```

### 4.2 Sources de Données

#### Données Utilisateur (User & Business)

| Donnée nécessaire | Source | Accès |
|-------------------|--------|-------|
| `businessId` (user_id) | Session NextAuth | `session?.user?.businessId` |
| `subscriptionStatus` | Session NextAuth | `session?.user?.subscriptionStatus` |
| `isPro` | Session NextAuth | `session?.user?.isPro` |

**Accès côté client :**

```typescript
"use client";
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const businessId = session?.user?.businessId;
```

#### Données de Navigation

| Donnée nécessaire | Source | Accès |
|-------------------|--------|-------|
| `page_path` | Next.js router | `usePathname()` |
| `referrer` | Document | `document.referrer` |
| `page_location` | Window | `window.location.href` |

### 4.3 Composants Globaux

#### AnalyticsProvider

```typescript
// components/analytics/AnalyticsProvider.tsx
"use client";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId || status === "loading") return;

    if (status === "authenticated" && session?.user?.businessId && window.gtag) {
      window.gtag("config", gaId, {
        user_id: session.user.businessId,
        user_properties: {
          subscription_status: session.user.subscriptionStatus,
          is_pro: session.user.isPro
        }
      });
    }
  }, [session, status, gaId]);

  return <>{children}</>;
}
```

#### useAnalytics Hook

```typescript
// hooks/useAnalytics.ts
"use client";

export function useAnalytics() {
  const { data: session } = useSession();

  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window === "undefined" || !window.gtag) return;

    const enrichedParams = {
      ...params,
      ...(session?.user?.businessId && { user_id: session.user.businessId })
    };

    window.gtag("event", eventName, enrichedParams);
  };

  return { trackEvent };
}
```

### 4.4 Utility Functions

```typescript
// lib/analytics/utils.ts

export function parseSignUpErrorType(errorMessage: string): string {
  const lowercased = errorMessage.toLowerCase();

  if (lowercased.includes("déjà utilisé") || lowercased.includes("already exists")) {
    return "email_exists";
  }

  if (lowercased.includes("validation") || lowercased.includes("invalide")) {
    return "validation_failed";
  }

  if (lowercased.includes("oauth") || lowercased.includes("google")) {
    return "oauth_failed";
  }

  return "server_error";
}

export function sanitizeErrorMessage(message: string, maxLength = 100): string {
  return message
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email]")
    .substring(0, maxLength);
}
```

---

## 5. Configuration GA4 et Maintenance

### 5.1 Configuration Initiale GA4

#### Paramètres de Base
- **Fuseau horaire** : Europe/Paris (GMT+1)
- **Devise** : Euro (EUR)
- **Secteur** : Services aux entreprises

#### Mesures Améliorées
- ✅ Pages vues
- ✅ Scrolling (90%)
- ✅ Clics sortants
- ✅ Téléchargements de fichiers

#### User-ID
- ✅ Activer User-ID (Admin → Data Collection)
- ✅ Cocher "Inclure User-ID dans les rapports"

#### Google Signals
- ✅ Activer pour données démographiques

### 5.2 Conversions

**Procédure :**
1. Déployer le code avec tracking `sign_up`
2. Attendre 24-48h que l'événement apparaisse
3. Admin → Événements → Marquer `sign_up` comme conversion
4. Marquer `form_submit_contact` comme conversion

### 5.3 Custom Dimensions

Créer ces dimensions (Admin → Définitions personnalisées) :

| Nom dimension | Portée | Paramètre événement |
|---------------|--------|---------------------|
| Page Category | Event | `page_category` |
| CTA Location | Event | `cta_location` |
| Signup Method | Event | `method` |
| Error Type | Event | `error_type` |
| Subscription Status | User | `subscription_status` |
| First Field | Event | `first_field` |
| Content Type | Event | `content_type` |

### 5.4 Audiences

Créer ces audiences (Admin → Audiences) :

1. **Visiteurs Organiques SEO** : Source=google, Medium=organic
2. **Utilisateurs Inscrits** : A déclenché `sign_up`
3. **Abandons Formulaire** : `form_start_register` MAIS PAS `sign_up`
4. **Lecteurs Blog Engagés** : page_category=blog, engagement>120s, scroll≥75%
5. **Mobile vs Desktop** : Segmenté par device_category

### 5.5 Intégration Search Console

Admin → Liens avec des produits → Search Console → Associer

### 5.6 Alertes Recommandées

1. **Chute inscriptions** : sign_up < 5/semaine
2. **Erreurs élevées** : sign_up_error > 15%
3. **Trafic anormal** : Sessions organiques -70% sur 7 jours

### 5.7 Maintenance Récurrente

#### Hebdomadaire (5 min)
- Vérifier dashboard acquisition SEO
- Comparer semaine vs précédente
- Checker alertes

#### Mensuelle (30 min)
- Analyser funnel complet
- Performance contenus SEO
- Analyse échecs inscription
- Taux conversion mobile vs desktop

#### Trimestrielle (2h)
- Audit événements trackés
- Review custom dimensions
- Analyse attribution
- Audit RGPD
- Mise à jour documentation

### 5.8 Checklist Déploiement Production

**Avant merge :**
- [ ] Événements testés en staging avec DebugView
- [ ] Custom dimensions créées dans GA4
- [ ] Conversions marquées
- [ ] User ID activé
- [ ] Search Console associé
- [ ] Audiences créées
- [ ] Rapports créés
- [ ] Alertes configurées
- [ ] Tests E2E passent

**J+1 :**
- [ ] Vérifier Realtime Report
- [ ] Vérifier DebugView production
- [ ] Comparer volumes vs DB

**J+7 :**
- [ ] Custom dimensions peuplées
- [ ] Conversions comptabilisées
- [ ] Premier funnel analysé

### 5.9 Troubleshooting

#### Événements n'apparaissent pas
1. Vérifier `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. Vérifier `window.gtag` défini
3. Vérifier consentement cookies
4. Vérifier requêtes Network

#### User ID manquant
1. Vérifier `session?.user?.businessId`
2. Vérifier callbacks NextAuth
3. Activer User-ID dans GA4

#### Conversions non comptabilisées
1. Vérifier événement marqué comme conversion
2. Attendre 24-48h
3. Vérifier nom événement exact

---

## Annexes

### Références Techniques

- [Plan de Mesure](./measurement-plan.md)
- [Guide Rapide GA4](./ga4-quick-guide.md)
- [CLAUDE.md - Section Analytics](../../CLAUDE.md#analytics--tracking)

### Ressources Externes

- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Next.js Third Parties Package](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)
- [RGPD et Analytics](https://www.cnil.fr/fr/cookies-et-autres-traceurs)

---

**Dernière mise à jour** : 2025-12-25
**Prochaine révision** : Q1 2026
