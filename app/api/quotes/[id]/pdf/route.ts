import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuote } from "@/app/actions/quotes";
import { renderToStream } from "@react-pdf/renderer";
import QuotePDF from "@/components/pdf/QuotePDF";
import {
  auditLog,
  AuditAction,
  AuditLevel,
  extractRequestInfo,
} from "@/lib/audit-logger";
import type { Quote, Client, Business, QuoteItem, Service } from "@prisma/client";

interface QuoteWithRelations extends Quote {
  client: Client | null;
  business: Business;
  items: (QuoteItem & { service: Service | null })[];
}

function generatePdfFileName(quote: QuoteWithRelations): string {
  const { pdfFileNamePrefix } = quote.business;
  const client = quote.client;

  // Si pas de préfixe OU pas de client, utiliser le numéro de devis
  if (!pdfFileNamePrefix || !client) {
    return `${quote.quoteNumber}.pdf`;
  }

  // Sinon, utiliser le format personnalisé
  const clientName = `${client.lastName} ${client.firstName}`;
  return `${pdfFileNamePrefix} - ${clientName}.pdf`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const result = await getQuote(id);

  if (!result.success || !result.data) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }

  try {
    const pdfElement = QuotePDF({ quote: result.data });
    const stream = await renderToStream(pdfElement);

    // Log d'audit pour génération de PDF
    const requestInfo = extractRequestInfo(request);
    await auditLog({
      action: AuditAction.QUOTE_PDF_GENERATED,
      level: AuditLevel.INFO,
      userId: session.user.id,
      businessId: session.user.businessId,
      resourceId: result.data.id,
      resourceType: "Quote",
      metadata: {
        quoteNumber: result.data.quoteNumber,
      },
      ...requestInfo,
    });

    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${generatePdfFileName(result.data)}"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}
