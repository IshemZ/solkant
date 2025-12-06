import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Vérifie si l'utilisateur a un accès PRO actif
 * Redirige vers /pricing si l'accès est refusé
 */
export async function requireProAccess() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { isPro: true } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(business as any)?.isPro) {
    redirect("/pricing");
  }

  return true;
}

/**
 * Vérifie si l'utilisateur a un accès PRO actif (sans redirection)
 * Retourne true/false
 */
export async function checkProAccess(): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return false;
  }

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { isPro: true } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  return (business as any)?.isPro ?? false; // eslint-disable-line @typescript-eslint/no-explicit-any
}
