/**
 * Page de réinitialisation de mot de passe avec code OTP
 * Permet d'entrer le code reçu par email et définir un nouveau mot de passe
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
import ResetPasswordForm from "./_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe - Solkant",
  description:
    "Entrez le code reçu par email pour réinitialiser votre mot de passe.",
};

export default function ResetPasswordPage() {
  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md" id="main-content">
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>
              Entrez le code à 6 chiffres reçu par email et choisissez un
              nouveau mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="text-center">Chargement...</div>}
            >
              <ResetPasswordForm />
            </Suspense>

            <div className="mt-6 text-center text-sm">
              <Link
                href="/mot-de-passe-oublie"
                className="text-primary hover:underline"
              >
                Renvoyer un code
              </Link>
              {" · "}
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
