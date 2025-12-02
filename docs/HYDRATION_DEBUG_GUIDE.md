# 🐛 Guide de Debug - Erreurs d'Hydratation

## 🎯 Diagnostic Rapide

### Étape 1: Identifier si c'est lié aux extensions

```bash
# Ouvrir Chrome en mode navigation privée (sans extensions)
# macOS
open -na "Google Chrome" --args --incognito http://localhost:3000

# Windows
start chrome --incognito http://localhost:3000

# Linux
google-chrome --incognito http://localhost:3000
```

**OU** manuellement :

1. Ouvrir `chrome://extensions`
2. Désactiver **toutes** les extensions
3. Rafraîchir l'application

### Étape 2: Vérifier les sources courantes

#### A. Extensions de navigateur qui modifient le DOM

Extensions connues pour causer des problèmes :

- ✅ **Grammarly** - Ajoute des attributs `data-grammarly` partout
- ✅ **LastPass** / **1Password** - Insèrent des iframes pour les mots de passe
- ✅ **Honey** / **Rakuten** - Modifient les boutons et prix
- ✅ **AdBlock / uBlock** - Suppriment des éléments du DOM
- ✅ **React DevTools** - Ajoutent des attributs data pour le debug
- ✅ **Vue DevTools** / **Redux DevTools** - Idem
- ✅ **Dark Reader** - Modifient les styles et classes
- ✅ **Wappalyzer** - Analysent et modifient la page

#### B. Code problématique

```tsx
// ❌ MAUVAIS - Cause hydration mismatch
export function Component() {
  return (
    <div>
      {/* Valeur différente serveur vs client */}
      {new Date().toLocaleDateString("fr-FR")}
      {Date.now()}
      {Math.random()}

      {/* Dépend du timezone/locale */}
      {new Date().getFullYear()}

      {/* Variables CSS calculées */}
      <div className="bg-muted" />

      {/* Condition côté client uniquement */}
      {typeof window !== "undefined" && <ClientOnlyContent />}
    </div>
  );
}

// ✅ BON - Hydration-safe
import { formatDate } from "@/lib/date-utils";

const CURRENT_YEAR = new Date().getFullYear(); // Au module level

export function Component() {
  return (
    <div>
      {/* Formatage UTC déterministe */}
      {formatDate(date)}

      {/* Constante évaluée une fois */}
      {CURRENT_YEAR}

      {/* Opacité Tailwind statique */}
      <div className="bg-foreground/10" />

      {/* Utiliser useHydrated() si nécessaire */}
      <ClientOnlyContent />
    </div>
  );
}
```

## 🔍 Méthodes de Debug

### Méthode 1: Debugger React

Ajoutez dans votre composant problématique :

```tsx
"use client";

import { useEffect } from "react";

export function MyComponent() {
  useEffect(() => {
    console.log("🔵 CLIENT: Component hydrated", {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      extensions: document.querySelectorAll("[data-*]").length,
    });
  }, []);

  console.log("🟢 RENDER: Component rendering", {
    isServer: typeof window === "undefined",
  });

  return <div>Content</div>;
}
```

### Méthode 2: Utiliser HydrationDebugger

```tsx
// app/layout.tsx
import { HydrationDebugger } from "@/components/HydrationDebugger";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <HydrationDebugger />}
      </body>
    </html>
  );
}
```

### Méthode 3: Binary Search

Commentez progressivement des sections de votre page :

```tsx
export default function Page() {
  return (
    <div>
      <Header /> {/* ✅ OK */}
      {/* <MainContent /> */} {/* ❌ Problème ici ? */}
      {/* <Footer /> */}
    </div>
  );
}
```

### Méthode 4: React Strict Mode

Le Strict Mode peut révéler des problèmes d'hydratation :

```tsx
// app/layout.tsx
import { StrictMode } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {process.env.NODE_ENV === "development" ? (
          <StrictMode>{children}</StrictMode>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
```

## 🛠️ Solutions par Type d'Erreur

### 1. Extensions de navigateur

**Solution** : Ajouter `suppressHydrationWarning` **uniquement** sur `<html>` ou `<body>` :

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
```

⚠️ **Attention** : N'utilisez `suppressHydrationWarning` **QUE** si vous êtes **certain** que le problème vient des extensions, pas de votre code.

### 2. Dates/Timestamps

**Solution** : Utiliser les fonctions UTC de `lib/date-utils.ts` :

```tsx
import { formatDate, formatDateTime } from "@/lib/date-utils";

// ✅ Au lieu de
{
  new Date().toLocaleDateString("fr-FR");
}

// ✅ Utiliser
{
  formatDate(date);
}
```

### 3. Classes CSS dynamiques

**Solution** : Utiliser des opacités Tailwind au lieu de variables CSS :

```tsx
// ❌ Au lieu de
<div className="bg-muted" />

// ✅ Utiliser
<div className="bg-foreground/10" />
```

### 4. Contenu client-only

**Solution** : Utiliser `useHydrated()` hook :

```tsx
"use client";

import { useHydrated } from "@/components/HydrationDebugger";

export function ClientOnlyComponent() {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <Skeleton />; // Skeleton identique au SSR
  }

  return <RealContent />;
}
```

### 5. Third-party scripts

**Solution** : Charger après hydratation :

```tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";

export function Analytics() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return <Script src="https://analytics.example.com/script.js" />;
}
```

## 🧪 Tests

Exécutez la suite de tests d'hydratation :

```bash
npm run test:hydration
```

52 tests doivent passer, couvrant :

- ✅ Formatage de dates cohérent
- ✅ Classes Tailwind déterministes
- ✅ Absence d'anti-patterns
- ✅ Loading states hydration-safe

## 📊 Checklist de Vérification

Avant de déployer, vérifiez :

- [ ] Aucun `new Date().toLocaleDateString()` dans les Server Components
- [ ] Aucun `Math.random()` ou `Date.now()` dans le rendu
- [ ] Utilisation de `formatDate()` pour toutes les dates
- [ ] Skeletons utilisent `bg-foreground/10` au lieu de `bg-muted`
- [ ] Constantes module-level pour valeurs calculées (ex: `CURRENT_YEAR`)
- [ ] Tests d'hydratation passent (52/52)
- [ ] Testé en navigation privée (sans extensions)
- [ ] Aucune erreur dans la console en développement

## 🆘 Si Rien Ne Fonctionne

1. **Comparez le HTML** :

   ```bash
   # Voir le HTML généré côté serveur
   curl http://localhost:3000 > server.html

   # Comparer avec le HTML après hydratation (DevTools > Elements)
   ```

2. **Activer les logs verbeux** :

   ```tsx
   // next.config.ts
   export default {
     reactStrictMode: true,
     logging: {
       fetches: {
         fullUrl: true,
       },
     },
   };
   ```

3. **Isoler le composant** :
   Créez une page de test minimale avec uniquement le composant suspect.

4. **Vérifier Next.js et React versions** :

   ```bash
   npm list next react react-dom
   ```

5. **Clear cache** :
   ```bash
   rm -rf .next
   npm run dev
   ```

## 📚 Ressources

- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration Docs](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Documentation des corrections](./HYDRATION_FIX.md)
- [Tests d'hydratation](./TESTS_HYDRATION.md)

---

**Dernière mise à jour** : 2 décembre 2025
