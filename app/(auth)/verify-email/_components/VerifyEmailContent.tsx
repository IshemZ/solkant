"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmailToken } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";

type VerificationState =
  | "loading"
  | "success"
  | "error"
  | "invalid_token"
  | "expired";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<VerificationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setState("invalid_token");
        return;
      }

      const result = await verifyEmailToken(token);

      if (result.success) {
        setState("success");
        // Rediriger vers login après 3 secondes
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 3000);
      } else {
        if (result.error?.includes("expiré")) {
          setState("expired");
        } else {
          setState("error");
        }
        setErrorMessage(result.error || "Une erreur est survenue");
      }
    }

    verify();
  }, [token, router]);

  return (
    <div className="w-full max-w-md p-8 bg-card border rounded-lg shadow-lg">
      {/* Loading */}
      {state === "loading" && (
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Vérification en cours...</h1>
          <p className="text-muted-foreground">
            Nous vérifions votre adresse email.
          </p>
        </div>
      )}

      {/* Success */}
      {state === "success" && (
        <div className="text-center">
          <div className="rounded-full bg-green-100 p-3 w-fit mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Email vérifié avec succès !
          </h1>
          <p className="text-muted-foreground mb-6">
            Votre compte est maintenant activé. Vous allez être redirigé vers la
            page de connexion...
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Se connecter maintenant</Link>
          </Button>
        </div>
      )}

      {/* Error - Token invalide */}
      {state === "invalid_token" && (
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-3 w-fit mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Lien invalide
          </h1>
          <p className="text-muted-foreground mb-6">
            Ce lien de vérification n'est pas valide. Veuillez vérifier que vous
            avez copié l'URL complète.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Retour à la connexion</Link>
          </Button>
        </div>
      )}

      {/* Error - Token expiré */}
      {state === "expired" && (
        <div className="text-center">
          <div className="rounded-full bg-orange-100 p-3 w-fit mx-auto mb-4">
            <Mail className="h-16 w-16 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-orange-600 mb-2">
            Lien expiré
          </h1>
          <Alert className="mb-6 text-left">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <p className="text-muted-foreground mb-6">
            Ce lien a expiré. Les liens de vérification sont valables 24 heures.
            Connectez-vous pour recevoir un nouveau lien.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      )}

      {/* Error - Autre */}
      {state === "error" && (
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-3 w-fit mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Erreur de vérification
          </h1>
          <Alert variant="destructive" className="mb-6 text-left">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/register">Créer un nouveau compte</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
