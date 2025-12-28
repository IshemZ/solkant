import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;

    const quote = await prisma.quote.findFirst({
      where: {
        id,
        businessId: session.user.businessId,
      },
      include: {
        client: true,
        business: true,
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }

    if (!quote.client?.email) {
      return NextResponse.json(
        { error: "Le client n'a pas d'adresse email ou a été supprimé" },
        { status: 400 }
      );
    }

    // Pour la démo, on simule l'envoi d'email
    // En production, utiliser Resend, SendGrid ou un autre service
    console.log(`📧 Email envoyé à ${quote.client.email}`);
    console.log(`Devis: ${quote.quoteNumber}`);

    return NextResponse.json({
      success: true,
      message: `Email envoyé à ${quote.client.email}`,
    });
  } catch (error) {
    console.error("Error sending quote email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
