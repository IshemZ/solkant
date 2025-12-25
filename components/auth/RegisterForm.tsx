"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  parseSignUpErrorType,
  sanitizeErrorMessage,
} from "@/lib/analytics/utils";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { trackEvent } = useAnalytics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formStartTracked, setFormStartTracked] = useState(false);

  // Track form_start_register on first field interaction
  const trackFormStart = (fieldName: string) => {
    if (!formStartTracked) {
      trackEvent("form_start_register", {
        first_field: fieldName,
        referrer: typeof document !== "undefined" ? document.referrer || "direct" : "unknown",
      });
      setFormStartTracked(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Une erreur est survenue";
        setError(errorMessage);

        // Track sign_up_error
        trackEvent("sign_up_error", {
          error_type: parseSignUpErrorType(errorMessage),
          method: "credentials",
          error_message: sanitizeErrorMessage(errorMessage),
        });

        setIsLoading(false);
        return;
      }

      // Track sign_up success
      if (data.trackSignUp && data.user?.business?.id) {
        trackEvent("sign_up", {
          method: "credentials",
          user_id: data.user.business.id,
        });
      }

      // ✅ NOUVEAU FLOW: Rediriger vers la page de vérification email
      // L'utilisateur doit vérifier son email avant de pouvoir se connecter
      router.push("/check-email");
      router.refresh();
    } catch (err) {
      const errorMessage = "Une erreur est survenue. Veuillez réessayer.";
      setError(errorMessage);

      // Track sign_up_error
      trackEvent("sign_up_error", {
        error_type: "server_error",
        method: "credentials",
        error_message: sanitizeErrorMessage(
          err instanceof Error ? err.message : errorMessage
        ),
      });

      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Track oauth_button_click
    trackEvent("oauth_button_click", {
      provider: "google",
      page_type: "register",
    });

    // Store flag for OAuth sign_up tracking after callback
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("new_signup", "google");
    }

    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            Nom
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => trackFormStart("name")}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            placeholder="Votre nom"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => trackFormStart("email")}
            required
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            placeholder="vous@exemple.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => trackFormStart("password")}
            required
            minLength={8}
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-foreground"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 block w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/40"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Création du compte..." : "Créer un compte"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-foreground/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </span>
      </button>
    </div>
  );
}

export default function RegisterForm() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-foreground/10 rounded" />
          <div className="h-10 bg-foreground/10 rounded" />
          <div className="h-10 bg-foreground/10 rounded" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
