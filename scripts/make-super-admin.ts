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
  console.log(`🔍 Recherche de l'utilisateur avec l'email: ${email}\n`)

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    }
  })

  if (!user) {
    console.error(`❌ Aucun utilisateur trouvé avec l'email: ${email}`)
    process.exit(1)
  }

  console.log(`📝 Utilisateur trouvé: ${user.name || 'Sans nom'} (${user.email})`)
  console.log(`   Rôle actuel: ${user.role}\n`)

  // Check if already super admin
  if (user.role === 'SUPER_ADMIN') {
    console.log(`✅ L'utilisateur est déjà SUPER_ADMIN. Aucune action nécessaire.`)
    return
  }

  // Update user role to SUPER_ADMIN
  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'SUPER_ADMIN' }
  })

  console.log(`🔐 Rôle mis à jour avec succès!`)
  console.log(`✅ ${user.email} est maintenant SUPER_ADMIN\n`)
  console.log(`💡 L'utilisateur doit se déconnecter et se reconnecter pour que les changements prennent effet.`)
}

// Main execution
const email = process.argv[2]

if (!email) {
  console.error('❌ Erreur: Email requis\n')
  console.log('Usage: npx tsx scripts/make-super-admin.ts <email>')
  console.log('Exemple: npx tsx scripts/make-super-admin.ts admin@example.com')
  process.exit(1)
}

makeSuperAdmin(email)
  .catch((error) => {
    console.error('Erreur:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
