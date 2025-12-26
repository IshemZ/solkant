import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

type QuoteWithRelations = {
  id: string;
  discount: number | Decimal;
  discountType: string;
  subtotal: number | Decimal;
  total: number | Decimal;
  items: Array<{
    price: number | Decimal;
    total: number | Decimal;
    packageId: string | null;
    package: {
      discountType: string;
      discountValue: Decimal;
    } | null;
  }>;
};

/**
 * Calcule les totaux d'un quote avec précision Decimal
 */
function calculateQuoteTotals(quote: QuoteWithRelations) {
  // 1. Calculer subtotal des items
  const subtotal = quote.items.reduce(
    (sum, item) => sum.add(new Decimal(item.total)),
    new Decimal(0)
  );

  // 2. Calculer remises forfaits
  const packageDiscountsTotal = quote.items.reduce((sum, item) => {
    if (!item.packageId || !item.package) return sum;

    const basePrice = new Decimal(item.price);
    let discount = new Decimal(0);

    if (item.package.discountType === 'PERCENTAGE') {
      discount = basePrice.times(item.package.discountValue).div(100);
    } else if (item.package.discountType === 'FIXED') {
      discount = new Decimal(item.package.discountValue);
    }

    return sum.add(discount);
  }, new Decimal(0));

  // 3. Sous-total après remises forfaits
  const subtotalAfterPackageDiscounts = subtotal.minus(packageDiscountsTotal);

  // 4. Calculer remise globale
  const discountValue = new Decimal(quote.discount);
  const discountAmount = quote.discountType === 'PERCENTAGE'
    ? subtotalAfterPackageDiscounts.times(discountValue).div(100)
    : discountValue;

  // 5. Total final
  const total = subtotalAfterPackageDiscounts.minus(discountAmount);

  return {
    newSubtotal: subtotal,
    newTotal: total
  };
}

/**
 * Recalcule tous les quotes existants
 */
async function recalculateQuoteTotals() {
  console.log('🔄 Début du recalcul des totaux de quotes...\n');

  const quotes = await prisma.quote.findMany({
    include: {
      items: {
        include: {
          package: true,
          service: true
        }
      }
    }
  });

  console.log(`📊 Total de quotes à traiter : ${quotes.length}\n`);

  let updatedCount = 0;
  let totalDelta = new Decimal(0);
  let maxDelta = new Decimal(0);

  for (const quote of quotes) {
    const { newSubtotal, newTotal } = calculateQuoteTotals(quote);

    const delta = newTotal.minus(new Decimal(quote.total)).abs();

    if (!delta.isZero()) {
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          subtotal: newSubtotal,
          total: newTotal
        }
      });

      updatedCount++;
      totalDelta = totalDelta.plus(delta);

      if (delta.greaterThan(maxDelta)) {
        maxDelta = delta;
      }
    }
  }

  console.log('\n✅ Migration terminée\n');
  console.log('📈 Statistiques :');
  console.log(`   • Quotes traités : ${quotes.length}`);
  console.log(`   • Quotes mis à jour : ${updatedCount}`);
  console.log(`   • Quotes inchangés : ${quotes.length - updatedCount}`);

  if (updatedCount > 0) {
    const avgDelta = totalDelta.div(updatedCount);
    console.log(`   • Delta moyen : ${avgDelta.toFixed(4)}€`);
    console.log(`   • Delta maximum : ${maxDelta.toFixed(4)}€`);
  }

  await prisma.$disconnect();
}

recalculateQuoteTotals().catch((error) => {
  console.error('❌ Erreur lors du recalcul :', error);
  process.exit(1);
});
