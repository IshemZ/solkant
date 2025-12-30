/**
 * Script to promote a user to SUPER_ADMIN role
 *
 * Usage: npx tsx scripts/make-super-admin.ts <email>
 * Example: npx tsx scripts/make-super-admin.ts admin@example.com
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
})

async function makeSuperAdmin(email: string) {
  console.log(`🔍 Recherche du user avec email: ${email}...`)

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true
    }
  })

  if (!user) {
    console.error(`❌ User avec email ${email} introuvable`)
    console.log('\n💡 Vérifiez que le user existe dans la base de données.')
    process.exit(1)
  }

  if (user.role === 'SUPER_ADMIN') {
    console.log(`✅ ${email} est déjà super admin`)
    return
  }

  console.log(`📝 Promotion de ${email} en SUPER_ADMIN...`)

  await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' }
  })

  console.log(`✅ ${email} promu SUPER_ADMIN avec succès`)
  console.log('\n🔐 Déconnectez-vous et reconnectez-vous pour que les changements prennent effet.')
}

// Main execution
const email = process.argv[2]

if (!email) {
  console.error('❌ Email manquant')
  console.log('\nUsage: npx tsx scripts/make-super-admin.ts <email>')
  console.log('Exemple: npx tsx scripts/make-super-admin.ts admin@solkant.com')
  process.exit(1)
}

makeSuperAdmin(email)
  .catch((error) => {
    console.error('❌ Erreur:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
