import { Suspense } from "react";
import { Metadata } from "next";
import VerifyEmailContent from "./_components/VerifyEmailContent";

export const metadata: Metadata = {
  title: "Vérification Email | Solkant",
  description:
    "Confirmez votre adresse email pour accéder à votre compte Solkant",
  robots: "noindex, nofollow",
};

/**
 * Page de vérification d'email
 * Accessible via le lien reçu par email : /verify-email?token=xxx
 *
 * Flow :
 * 1. Utilisateur clique sur le lien dans l'email
 * 2. Cette page extrait le token des searchParams
 * 3. Appelle verifyEmailToken() via Server Action
 * 4. Redirige vers /dashboard si succès, ou affiche erreur
 */
export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-card border rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
