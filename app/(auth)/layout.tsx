import type { Metadata } from "next";

// Métadonnées pour toutes les pages d'authentification
// Ces pages ne doivent PAS être indexées par les moteurs de recherche
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
