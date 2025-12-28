"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";
import { resendVerificationEmail } from "@/app/actions/auth";
import { useState } from "react";

/**
 * Bannière affichée quand l'utilisateur n'a pas vérifié son email
 * (En théorie, ne devrait jamais être affichée car l'accès est bloqué au niveau layout)
 */
export default function EmailVerificationBanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    setMessage("");

    const result = await resendVerificationEmail({});

    if (result.success) {
      setMessage("✅ Email renvoyé ! Vérifiez votre boîte de réception.");
    } else {
      setMessage(`❌ ${result.error}`);
    }

    setIsLoading(false);
  };

  if (isDismissed) return null;

  return (
    <div className="bg-orange-50 border-b border-orange-200">
      <div className="container mx-auto px-4 py-3">
        <Alert className="border-orange-300 bg-orange-50">
          <Mail className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-orange-800 font-medium">
                Veuillez vérifier votre adresse email pour accéder à toutes les
                fonctionnalités.
              </p>
              {message && (
                <p className="text-xs text-orange-700 mt-1">{message}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleResend}
                disabled={isLoading}
                className="border-orange-300 hover:bg-orange-100"
              >
                {isLoading ? "Envoi..." : "Renvoyer l'email"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsDismissed(true)}
                className="hover:bg-orange-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
