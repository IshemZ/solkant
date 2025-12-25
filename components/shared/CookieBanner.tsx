"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export function CookieBanner() {
  // Initialiser l'état depuis localStorage si disponible
  const [preferences, setPreferences] = useState(() => {
    if (typeof window === "undefined") {
      return { necessary: true, analytics: false, functional: false };
    }
    const consent = localStorage.getItem("cookie-consent");
    if (consent) {
      try {
        return JSON.parse(consent);
      } catch {
        return { necessary: true, analytics: false, functional: false };
      }
    }
    return { necessary: true, analytics: false, functional: false };
  });

  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const enableGoogleAnalytics = useCallback(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }, []);

  const disableGoogleAnalytics = useCallback(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }, []);

  const applyConsent = useCallback(
    (prefs: typeof preferences) => {
      if (prefs.analytics) {
        enableGoogleAnalytics();
      } else {
        disableGoogleAnalytics();
      }

      if (prefs.functional) {
        console.log("Cookies fonctionnels activés");
      }
    },
    [enableGoogleAnalytics, disableGoogleAnalytics]
  );

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Appliquer le consentement déjà sauvegardé
      applyConsent(preferences);
    }
  }, [applyConsent, preferences]);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    applyConsent(allAccepted);
    setShowBanner(false);
  };

  const rejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(onlyNecessary));
    applyConsent(onlyNecessary);
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    applyConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Banner principal */}
      {!showPreferences && (
        <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white border-t border-gray-200 shadow-2xl">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <strong className="font-semibold">
                      🍪 Gestion des cookies
                    </strong>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Nous utilisons des cookies pour améliorer votre expérience,
                    analyser le trafic et personnaliser le contenu. Vous pouvez
                    accepter tous les cookies ou gérer vos préférences.{" "}
                    <Link
                      href="/politique-confidentialite"
                      className="underline hover:text-purple-600"
                    >
                      En savoir plus sur les cookies
                    </Link>
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Personnaliser
                  </button>
                  <button
                    onClick={rejectOptional}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Refuser
                  </button>
                  <button
                    onClick={acceptAll}
                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Tout accepter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de préférences */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowPreferences(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowPreferences(false);
              }}
              role="button"
              tabIndex={0}
              aria-label="Fermer le panneau de préférences"
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                      Gérer mes préférences de cookies
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Personnalisez vos choix concernant l&apos;utilisation des
                      cookies sur notre site. Vous pouvez modifier ces
                      paramètres à tout moment.
                    </p>

                    <div className="space-y-4">
                      {/* Cookies nécessaires */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                              🔒 Cookies strictement nécessaires
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              Essentiels au fonctionnement du site
                              (authentification, sécurité). Toujours actifs.
                            </p>
                          </div>
                          <div className="ml-4">
                            <input
                              type="checkbox"
                              checked={true}
                              disabled
                              className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-not-allowed opacity-50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cookies analytics */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                              📊 Cookies d&apos;analyse (Google Analytics)
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              Nous aident à comprendre comment vous utilisez
                              notre site pour l&apos;améliorer (données
                              anonymisées).
                            </p>
                          </div>
                          <div className="ml-4">
                            <input
                              type="checkbox"
                              checked={preferences.analytics}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  analytics: e.target.checked,
                                })
                              }
                              className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cookies fonctionnels */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                              ⚙️ Cookies fonctionnels
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              Mémorisent vos préférences (langue, thème,
                              paramètres d&apos;affichage).
                            </p>
                          </div>
                          <div className="ml-4">
                            <input
                              type="checkbox"
                              checked={preferences.functional}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  functional: e.target.checked,
                                })
                              }
                              className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 text-xs text-gray-500">
                      Pour plus d&apos;informations, consultez notre{" "}
                      <Link
                        href="/politique-confidentialite"
                        className="text-purple-600 hover:underline"
                      >
                        Politique de confidentialité
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={savePreferences}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:w-auto sm:text-sm"
                >
                  Enregistrer mes préférences
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
