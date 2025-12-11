#!/bin/bash

# Script pour corriger les tests après ajout de validateSessionWithEmail()
#
# Ce script ajoute automatiquement:
# 1. Mock de prisma.user dans les vi.mock()
# 2. MockUser avec emailVerified
# 3. Appel à prisma.user.findUnique() après getServerSession

set -e

echo "🔧 Correction des tests pour validateSessionWithEmail()..."

# Fichiers à corriger
FILES=(
  "tests/actions/business.test.ts"
  "tests/actions/clients.test.ts"
  "tests/actions/quotes.test.ts"
  "tests/actions/services.test.ts"
  "tests/actions/stripe.test.ts"
)

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⏭️  Skipping $file (not found)"
    continue
  fi

  echo "📝 Processing $file..."

  # 1. Ajouter user.findUnique au mock Prisma
  if grep -q "vi.mock(\"@/lib/prisma\"" "$file"; then
    if ! grep -q "user: {" "$file"; then
      # Trouver la ligne de fermeture du mock Prisma et ajouter user avant
      sed -i '' '/default: {/,/^  },$/{
        /^  },$/i\
    user: {\
      findUnique: vi.fn(),\
    },
      }' "$file"
      echo "  ✅ Ajouté user.findUnique au mock"
    fi
  fi

  # 2. Ajouter mockUser si absent
  if ! grep -q "const mockUser =" "$file"; then
    # Trouver mockSession et ajouter mockUser juste après
    awk '/const mockSession = \{/,/  \};/{
      if (/  \};/) {
        print
        print ""
        print "  const mockUser = {"
        print "    id: \"user_123\","
        print "    email: \"test@example.com\","
        print "    emailVerified: new Date(\"2024-01-01\"),"
        print "    name: \"Test User\","
        print "    password: null,"
        print "    image: null,"
        print "    verificationToken: null,"
        print "    tokenExpiry: null,"
        print "    createdAt: new Date(),"
        print "    updatedAt: new Date(),"
        print "  };"
        next
      }
    } 1' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    echo "  ✅ Ajouté mockUser"
  fi

  # 3. Ajouter appel mockResolvedValue après chaque getServerSession
  sed -i '' 's/vi\.mocked(getServerSession)\.mockResolvedValue(mockSession);/vi.mocked(getServerSession).mockResolvedValue(mockSession);\
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);/g' "$file"
  echo "  ✅ Ajouté appel prisma.user.findUnique"

  # 4. Ajouter stripePriceId, city, postalCode, country, tva si mockBusiness existe
  if grep -q "const mockBusiness =" "$file"; then
    if ! grep -q "stripePriceId:" "$file"; then
      sed -i '' '/stripeSubscriptionId: null,/a\
    stripePriceId: null,' "$file"
    fi
    if ! grep -q "city:" "$file"; then
      sed -i '' '/updatedAt: new Date(),/i\
    city: null,\
    postalCode: null,\
    country: null,\
    tva: null,' "$file"
    fi
    echo "  ✅ Ajouté champs manquants à mockBusiness"
  fi

done

echo ""
echo "✅ Correction terminée!"
echo "🧪 Lancement des tests pour vérifier..."

npm run test:run
