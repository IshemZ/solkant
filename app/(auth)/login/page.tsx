"use client";

import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  Configuration: "Erreur de configuration OAuth",
  AccessDenied: "Accès refusé",
  Verification: "Erreur de vérification",
  OAuthSignin: "Erreur lors de la connexion OAuth",
  OAuthCallback: "Erreur de callback OAuth",
  OAuthCreateAccount: "Erreur lors de la création du compte",
  EmailCreateAccount: "Erreur lors de la création du compte email",
  Callback: "Erreur de callback",
  OAuthAccountNotLinked: "Ce compte OAuth est déjà lié à un autre utilisateur",
  EmailSignin: "Erreur d'envoi de l'email de connexion",
  CredentialsSignin: "Email ou mot de passe invalide",
  SessionRequired: "Session requise",
  Default: "Une erreur est survenue lors de la connexion",
};

// Composant qui utilise useSearchParams - DOIT être dans Suspense
function LoginFormWithErrorHandler() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const initialError = urlError
    ? errorMessages[urlError] || errorMessages.Default
    : undefined;

  return <LoginForm initialError={initialError} />;
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Solkant
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Connectez-vous à votre compte
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
              <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
              <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
            </div>
          }
        >
          <LoginFormWithErrorHandler />
        </Suspense>

        <p className="text-center text-sm text-foreground/60">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}
