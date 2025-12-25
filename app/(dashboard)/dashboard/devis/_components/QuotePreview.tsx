import type {
  Quote,
  Client,
  Business,
  QuoteItem,
  Service,
} from "@prisma/client";
import { formatDate } from "@/lib/date-utils";
import { formatAddress } from "@/lib/utils";

interface QuoteWithRelations extends Quote {
  client: Client | null;
  business: Business;
  items: (QuoteItem & { service: Service | null })[];
}

interface QuotePreviewProps {
  quote: QuoteWithRelations;
}

/**
 * QuotePreview - Preview complet du devis avec tous les champs
 */
export default function QuotePreview({ quote }: QuotePreviewProps) {
  const businessAddress = formatAddress(quote.business);
  const clientAddress = quote.client ? formatAddress(quote.client) : "";

  return (
    <div className="rounded-lg border border-foreground/10 bg-white p-8 shadow-sm">
      {/* Quote Number and Dates */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {quote.quoteNumber}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Créé le {formatDate(quote.createdAt)}
          </p>
          {quote.validUntil && (
            <p className="mt-1 text-sm text-gray-600">
              Valable jusqu&apos;au {formatDate(quote.validUntil)}
            </p>
          )}
        </div>
      </div>

      {/* Business and Client Information */}
      <div className="mb-8 grid gap-8 sm:grid-cols-2">
        {/* Business Column */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
            De
          </h3>
          <div className="text-gray-900">
            <p className="font-bold">{quote.business.name}</p>
            {businessAddress.split("\n").map((line, i) => (
              <p key={i} className="text-sm">
                {line}
              </p>
            ))}
            {quote.business.phone && (
              <p className="text-sm">{quote.business.phone}</p>
            )}
            {quote.business.email && (
              <p className="text-sm">{quote.business.email}</p>
            )}
            {quote.business.siret && (
              <p className="mt-2 text-xs text-gray-500">
                SIRET: {quote.business.siret}
              </p>
            )}
          </div>
        </div>

        {/* Client Column */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
            Pour
          </h3>
          <div className="text-gray-900">
            {quote.client ? (
              <>
                <p className="font-bold">
                  {quote.client.firstName} {quote.client.lastName}
                </p>
                {clientAddress.split("\n").map((line, i) => (
                  <p key={i} className="text-sm">
                    {line}
                  </p>
                ))}
                {quote.client.phone && (
                  <p className="text-sm">{quote.client.phone}</p>
                )}
                {quote.client.email && (
                  <p className="text-sm">{quote.client.email}</p>
                )}
              </>
            ) : (
              <p className="text-sm italic text-gray-500">Client supprimé</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className="pb-2 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="pb-2 text-right text-sm font-semibold text-gray-700">
                Prix unitaire
              </th>
              <th className="pb-2 text-right text-sm font-semibold text-gray-700">
                Quantité
              </th>
              <th className="pb-2 text-right text-sm font-semibold text-gray-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                </td>
                <td className="py-3 text-right text-gray-900">
                  {item.price.toFixed(2)} €
                </td>
                <td className="py-3 text-right text-gray-900">
                  {item.quantity}
                </td>
                <td className="py-3 text-right font-medium text-gray-900">
                  {item.total.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium text-gray-900">
              {quote.subtotal.toFixed(2)} €
            </span>
          </div>
          {quote.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Remise
                {quote.discountType === "PERCENTAGE"
                  ? ` (${quote.discount}%)`
                  : ""}
              </span>
              <span className="font-medium text-red-600">
                -
                {(quote.discountType === "PERCENTAGE"
                  ? quote.subtotal * (quote.discount / 100)
                  : quote.discount
                ).toFixed(2)}{" "}
                €
              </span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-gray-300 pt-2">
            <span className="font-semibold text-gray-900">Total TTC</span>
            <span className="text-xl font-bold text-gray-900">
              {quote.total.toFixed(2)} €
            </span>
          </div>
          {quote.business.showInstallmentPayment && (
            <p className="pt-2 text-xs italic text-gray-600">
              Si paiement en 4× sans frais : {(quote.total / 4).toFixed(2)} € ×
              4
            </p>
          )}
        </div>
      </div>

      {/* Notes and Footer */}
      <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
        {quote.notes && (
          <div className="rounded-md bg-gray-50 p-4">
            <p className="mb-1 text-sm font-semibold text-gray-700">Notes</p>
            <p className="text-sm text-gray-600">{quote.notes}</p>
          </div>
        )}
        <div className="text-sm text-gray-500">
          <p>Bon pour accord</p>
          <p className="mt-2">
            Document sans valeur contractuelle avant signature
          </p>
        </div>
      </div>
    </div>
  );
}
