"use client";

import { useState } from "react";

interface QuoteSummaryCardProps {
  quote: {
    number: string;
    createdAt: Date;
    client: string;
    total: number;
  };
  onDelete?: (quoteNumber: string) => void;
}

export default function QuoteSummaryCard({ quote, onDelete }: Readonly<QuoteSummaryCardProps>) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Format date with French locale
  const formattedDate = quote.createdAt.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Format price with French locale
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR"
  }).format(quote.total);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(quote.number);
    }
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="space-y-3">
        {/* Quote Number */}
        <div>
          <span className="text-sm text-gray-500">Numéro :</span>
          <p className="font-semibold text-lg">{quote.number}</p>
        </div>

        {/* Created Date */}
        <div>
          <span className="text-sm text-gray-500">Date de création :</span>
          <p className="text-gray-900">{formattedDate}</p>
        </div>

        {/* Client Name */}
        <div>
          <span className="text-sm text-gray-500">Client :</span>
          <p className="text-gray-900">{quote.client}</p>
        </div>

        {/* Total Price */}
        <div>
          <span className="text-sm text-gray-500">Montant total :</span>
          <p className="text-xl font-bold text-gray-900">{formattedPrice}</p>
        </div>

        {/* Delete Button and Confirmation */}
        <div className="pt-4 border-t">
          {showConfirmation ? (
            <div className="space-y-3">
              <p className="text-center text-gray-700 font-medium">
                Supprimer ce devis ?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
