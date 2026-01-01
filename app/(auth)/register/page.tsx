import { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Inscription | Solkant",
  description: "Créez votre compte Solkant",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Solkant
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Créez votre compte</p>
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
          <RegisterForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <a
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Se connecter
          </a>
        </p>
      </div>
    </main>
  );
}
