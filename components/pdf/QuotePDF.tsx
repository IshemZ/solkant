import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
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

interface QuotePDFProps {
  quote: QuoteWithRelations;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#8B7355",
  },
  quoteNumber: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: "#666666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8B7355",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    width: "48%",
  },
  businessName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 3,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
    color: "#333333",
  },
  smallText: {
    fontSize: 8,
    color: "#666666",
    marginTop: 5,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#8B7355",
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333333",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 9,
    color: "#333333",
  },
  tableCellBold: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333333",
  },
  itemDescription: {
    fontSize: 8,
    color: "#666666",
    marginTop: 2,
  },
  col1: { width: "45%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "15%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalsBox: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: "#666666",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333333",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: "#8B7355",
    paddingTop: 8,
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B7355",
  },
  installmentPayment: {
    fontSize: 9,
    color: "#666666",
    marginTop: 10,
    fontStyle: "italic",
  },
  signatureSection: {
    marginTop: 30,
    alignItems: "flex-end",
  },
  signatureText: {
    fontSize: 10,
    color: "#333333",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    left: 40,
    right: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  footerText: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 5,
  },
  generatedBy: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#999999",
    textAlign: "center",
  },
  notes: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 8,
    color: "#666666",
  },
});

export default function QuotePDF({ quote }: QuotePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {quote.business.logo && (
            <View style={styles.logoContainer}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={quote.business.logo} style={styles.logo} />
            </View>
          )}
          <View style={styles.headerLeft} />
          <View style={styles.headerRight}>
            <Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
            <Text style={styles.date}>Date: {formatDate(quote.createdAt)}</Text>
            <Text style={styles.date}>
              {quote.validUntil
                ? `Valable jusqu'au: ${formatDate(quote.validUntil)}`
                : "Devis valable 30 jours"}
            </Text>
          </View>
        </View>

        {/* Business and Client Info */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.businessName}>{quote.business.name}</Text>
            {formatAddress(quote.business)
              .split("\n")
              .map((line, i) => (
                <Text key={i} style={styles.text}>
                  {line}
                </Text>
              ))}
            {quote.business.phone && (
              <Text style={styles.text}>{quote.business.phone}</Text>
            )}
            {quote.business.email && (
              <Text style={styles.text}>{quote.business.email}</Text>
            )}
            {quote.business.siret && (
              <Text style={styles.smallText}>
                SIRET: {quote.business.siret}
              </Text>
            )}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Client</Text>
            {quote.client ? (
              <>
                <Text style={styles.businessName}>
                  {quote.client.firstName} {quote.client.lastName}
                </Text>
                {formatAddress(quote.client)
                  .split("\n")
                  .map((line, i) => (
                    <Text key={i} style={styles.text}>
                      {line}
                    </Text>
                  ))}
                {quote.client.phone && (
                  <Text style={styles.text}>{quote.client.phone}</Text>
                )}
                {quote.client.email && (
                  <Text style={styles.text}>{quote.client.email}</Text>
                )}
              </>
            ) : (
              <Text style={[styles.text, { fontStyle: "italic" }]}>
                Client supprimé
              </Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>
              Prix unitaire
            </Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Quantité</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Total</Text>
          </View>

          {quote.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.col1}>
                <Text style={styles.tableCellBold}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
              </View>
              <Text style={[styles.tableCell, styles.col2]}>
                {item.price.toFixed(2)} €
              </Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCellBold, styles.col4]}>
                {item.total.toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total</Text>
              <Text style={styles.totalValue}>
                {quote.subtotal.toFixed(2)} €
              </Text>
            </View>

            {quote.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Remise</Text>
                <Text style={[styles.totalValue, { color: "#dc2626" }]}>
                  -{quote.discount.toFixed(2)} €
                </Text>
              </View>
            )}

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total TTC</Text>
              <Text style={styles.grandTotalValue}>
                {quote.total.toFixed(2)} €
              </Text>
            </View>
            {/* TODO: Ajouter une condition pour afficher uniquement si le paiement en plusieurs fois est activé dans les paramètres de l'entreprise */}
            <Text style={styles.installmentPayment}>
              Si paiement en 4× sans frais : {(quote.total / 4).toFixed(2)} € ×
              4
            </Text>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureText}>Bon pour accord</Text>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Document sans valeur contractuelle avant signature
          </Text>
        </View>

        {/* Generated By - Centered at bottom */}
        <Text style={styles.generatedBy}>
          Devis généré automatiquement par Solkant
        </Text>
      </Page>
    </Document>
  );
}
