import { Metadata } from "next";
import { getQuote } from "@/app/actions/quotes";
import { redirect } from "next/navigation";
import QuoteView from "../_components/QuoteView";

interface QuotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getQuote(id);

  if (result.error || !result.data) {
    return {
      title: "Devis introuvable | Solkant",
      description: "Ce devis n'existe pas ou n'est plus accessible.",
    };
  }

  const quote = result.data;
  const clientName = `${quote.client.firstName} ${quote.client.lastName}`;

  return {
    title: `Devis ${quote.quoteNumber} - ${clientName} | Solkant`,
    description: `Devis ${
      quote.quoteNumber
    } pour ${clientName} - Montant: ${quote.totalAmount.toFixed(
      2
    )} € - Statut: ${quote.status}`,
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params;
  const result = await getQuote(id);

  if (result.error || !result.data) {
    redirect("/dashboard/devis");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <QuoteView quote={result.data} />
    </div>
  );
}
