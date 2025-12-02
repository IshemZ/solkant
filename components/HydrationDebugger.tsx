"use client";

import { useEffect, useState } from "react";

/**
 * Composant de debug pour détecter les problèmes d'hydratation
 * À utiliser UNIQUEMENT en développement pour diagnostiquer les erreurs
 *
 * Usage: Ajouter <HydrationDebugger /> dans le layout ou la page problématique
 */
export function HydrationDebugger() {
  const [hydrated, setHydrated] = useState(false);
  const [info, setInfo] = useState({
    userAgent: "",
    extensions: [] as string[],
    timestamp: "",
    locale: "",
  });

  useEffect(() => {
    // Utiliser queueMicrotask pour éviter le setState synchrone
    queueMicrotask(() => {
      setHydrated(true);

      // Collecter les infos du navigateur
      setInfo({
        userAgent: navigator.userAgent,
        extensions: detectBrowserExtensions(),
        timestamp: new Date().toISOString(),
        locale: navigator.language,
      });
    }); // Écouter les erreurs d'hydratation
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("Hydration")) {
        console.error("🔴 HYDRATION ERROR DETECTED:", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          extensions: detectBrowserExtensions(),
        });
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Ne rien afficher en production
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  // Ne rien afficher avant hydratation
  if (!hydrated) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "12px",
        maxWidth: "400px",
        zIndex: 99999,
        fontFamily: "monospace",
      }}
    >
      <details>
        <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
          🔍 Hydration Debugger
        </summary>
        <div style={{ marginTop: "10px", fontSize: "11px" }}>
          <div>
            <strong>Status:</strong>{" "}
            <span style={{ color: "#10b981" }}>Hydrated ✓</span>
          </div>
          <div style={{ marginTop: "5px" }}>
            <strong>Browser:</strong> {getBrowserName(info.userAgent)}
          </div>
          <div>
            <strong>Locale:</strong> {info.locale}
          </div>
          <div>
            <strong>Time:</strong> {info.timestamp}
          </div>
          {info.extensions.length > 0 && (
            <div style={{ marginTop: "5px" }}>
              <strong style={{ color: "#f59e0b" }}>
                ⚠️ Extensions détectées:
              </strong>
              <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                {info.extensions.map((ext, i) => (
                  <li key={i}>{ext}</li>
                ))}
              </ul>
              <div style={{ color: "#f59e0b", fontSize: "10px" }}>
                Les extensions peuvent modifier le DOM et causer des erreurs
                d'hydratation
              </div>
            </div>
          )}
          <div
            style={{ marginTop: "10px", fontSize: "10px", color: "#9ca3af" }}
          >
            💡 Vérifiez la console pour les erreurs détaillées
          </div>
        </div>
      </details>
    </div>
  );
}

/**
 * Détecte les extensions de navigateur courantes qui modifient le DOM
 */
function detectBrowserExtensions(): string[] {
  const extensions: string[] = [];

  // Vérifier les éléments injectés par des extensions populaires
  const extensionIndicators = [
    { name: "Grammarly", selector: "grammarly-extension" },
    { name: "LastPass", selector: "#lp-extension" },
    { name: "Honey", selector: "#honeyExtension" },
    { name: "AdBlock", selector: '[id*="adblock"]' },
    {
      name: "React DevTools",
      check: () => !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
    },
    {
      name: "Redux DevTools",
      check: () => !!(window as any).__REDUX_DEVTOOLS_EXTENSION__,
    },
    {
      name: "Vue DevTools",
      check: () => !!(window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__,
    },
  ];

  extensionIndicators.forEach(({ name, selector, check }) => {
    if (check) {
      if (check()) {
        extensions.push(name);
      }
    } else if (selector && document.querySelector(selector)) {
      extensions.push(name);
    }
  });

  // Vérifier les attributs data-* ajoutés par les extensions
  const htmlElement = document.documentElement;
  const attributes = htmlElement.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (attr.name.startsWith("data-") && !attr.name.startsWith("data-next")) {
      extensions.push(`Unknown extension (${attr.name})`);
    }
  }

  return [...new Set(extensions)]; // Dédupliquer
}

/**
 * Extrait le nom du navigateur depuis le user agent
 */
function getBrowserName(userAgent: string): string {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";
  return "Unknown";
}

/**
 * Hook pour détecter si le composant est hydraté
 * Utile pour éviter les mismatches serveur/client
 *
 * @example
 * const isHydrated = useHydrated();
 * if (!isHydrated) return <Skeleton />;
 * return <RealContent />;
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Utiliser queueMicrotask pour éviter le setState synchrone
    queueMicrotask(() => setHydrated(true));
  }, []);

  return hydrated;
}
