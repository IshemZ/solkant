/**
 * Page de demande de réinitialisation de mot de passe
 * Permet à l'utilisateur d'entrer son email pour recevoir un code OTP
 */

import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkipLink } from "@/components/shared/SkipLink";
import RequestPasswordResetForm from "./_components/RequestPasswordResetFormSimple";

export const metadata: Metadata = {
  title: "Mot de passe oublié - Solkant",
  description:
    "Réinitialisez votre mot de passe en recevant un code par email.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md" id="main-content">
          <CardHeader>
            <CardTitle>Mot de passe oublié ?</CardTitle>
            <CardDescription>
              Entrez votre adresse email et nous vous enverrons un code de
              vérification pour réinitialiser votre mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="text-center">Chargement...</div>}
            >
              <RequestPasswordResetForm />
            </Suspense>

            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
