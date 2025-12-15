/**
 * Template HTML pour l'envoi de devis par email
 * Format professionnel et responsive
 */

interface QuoteEmailProps {
  quoteNumber: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  clientName: string;
  validUntil: string;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  pdfUrl?: string; // URL du PDF si disponible
}

export function generateQuoteEmail(props: QuoteEmailProps): string {
  const {
    quoteNumber,
    businessName,
    businessEmail,
    businessPhone,
    businessAddress,
    clientName,
    validUntil,
    items,
    subtotal,
    discount,
    total,
    notes,
    pdfUrl,
  } = props;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Devis ${quoteNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #D4B5A0;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #8B7355;
      margin: 0;
      font-size: 28px;
    }
    .quote-number {
      color: #D4B5A0;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .info-section {
      background-color: #f9f9f9;
      border-left: 4px solid #D4B5A0;
      padding: 15px;
      margin: 20px 0;
    }
    .info-section strong {
      color: #8B7355;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    .items-table th {
      background-color: #8B7355;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    .items-table tr:last-child td {
      border-bottom: none;
    }
    .item-description {
      font-size: 13px;
      color: #666;
      margin-top: 4px;
    }
    .totals {
      margin-top: 30px;
      border-top: 2px solid #e0e0e0;
      padding-top: 20px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      font-size: 16px;
    }
    .totals-row.total {
      font-size: 20px;
      font-weight: bold;
      color: #8B7355;
      border-top: 2px solid #D4B5A0;
      padding-top: 15px;
      margin-top: 15px;
    }
    .notes {
      background-color: #fff8f0;
      border-left: 4px solid #D4B5A0;
      padding: 15px;
      margin: 20px 0;
      font-style: italic;
      color: #666;
    }
    .cta-button {
      display: inline-block;
      background-color: #8B7355;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .cta-button:hover {
      background-color: #6d5a43;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #8B7355;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      .container {
        padding: 20px;
      }
      .items-table {
        font-size: 14px;
      }
      .items-table th,
      .items-table td {
        padding: 8px 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${businessName}</h1>
      <div class="quote-number">Devis ${quoteNumber}</div>
    </div>

    <div class="greeting">
      <p>Bonjour ${clientName},</p>
      <p>Veuillez trouver ci-dessous votre devis détaillé.</p>
    </div>

    <div class="info-section">
      <strong>Validité du devis :</strong> Jusqu'au ${validUntil}
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Prestation</th>
          <th style="text-align: center;">Qté</th>
          <th style="text-align: right;">Prix unitaire</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
          <tr>
            <td>
              <strong>${item.name}</strong>
              ${item.description ? `<div class="item-description">${item.description}</div>` : ""}
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${item.price.toFixed(2)} €</td>
            <td style="text-align: right;"><strong>${item.total.toFixed(2)} €</strong></td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Sous-total :</span>
        <span>${subtotal.toFixed(2)} €</span>
      </div>
      ${
        discount > 0
          ? `
      <div class="totals-row">
        <span>Remise :</span>
        <span>-${discount.toFixed(2)} €</span>
      </div>
      `
          : ""
      }
      <div class="totals-row total">
        <span>TOTAL TTC :</span>
        <span>${total.toFixed(2)} €</span>
      </div>
    </div>

    ${
      notes
        ? `
    <div class="notes">
      <strong>Notes :</strong><br>
      ${notes}
    </div>
    `
        : ""
    }

    ${
      pdfUrl
        ? `
    <div style="text-align: center;">
      <a href="${pdfUrl}" class="cta-button">Télécharger le PDF</a>
    </div>
    `
        : ""
    }

    <div class="footer">
      <p><strong>${businessName}</strong></p>
      <p>${businessAddress.replace(/\n/g, "<br>")}</p>
      <p>
        Email : <a href="mailto:${businessEmail}">${businessEmail}</a><br>
        Téléphone : ${businessPhone}
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        Cet email a été généré automatiquement par Solkant.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Génère le sujet de l'email en français
 */
export function generateQuoteEmailSubject(
  quoteNumber: string,
  businessName: string
): string {
  return `Devis ${quoteNumber} de ${businessName}`;
}
