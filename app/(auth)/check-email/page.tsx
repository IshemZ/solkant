import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Vérifiez votre email | Solkant",
  description: "Un email de vérification vous a été envoyé",
  robots: "noindex, nofollow",
};

/**
 * Page affichée après inscription
 * Informe l'utilisateur de vérifier son email avant de pouvoir se connecter
 *
 * Accessible après soumission du formulaire d'inscription
 */
export default function CheckEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
      <div className="w-full max-w-md p-8 bg-card border rounded-lg shadow-lg">
        <div className="text-center">
          {/* Icon */}
          <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-6">
            <Mail className="h-16 w-16 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-3">Vérifiez votre email</h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            Un email de confirmation a été envoyé à votre adresse email. Cliquez
            sur le lien dans l&apos;email pour activer votre compte.
          </p>

          {/* Info Alert */}
          <Alert className="mb-6 text-left">
            <AlertDescription>
              <strong>Important :</strong> Vous devez confirmer votre email
              avant de pouvoir accéder à votre espace Solkant.
            </AlertDescription>
          </Alert>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">
                Vous n&apos;avez pas reçu l&apos;email ?
              </strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Vérifiez votre dossier spam/courrier indésirable</li>
              <li>
                Attendez quelques minutes (l&apos;email peut prendre du temps)
              </li>
              <li>
                Le lien est valable pendant <strong>24 heures</strong>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Vous pourrez demander un nouveau lien après votre première
              connexion si nécessaire.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
