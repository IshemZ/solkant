import 'next-auth'
import { UserRole } from '@prisma/client'

/**
 * Extend NextAuth types to include custom user properties
 */

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      businessId?: string | null
      subscriptionStatus?: string | null
      isPro?: boolean | null
      impersonatingBusinessId?: string | null  // For Phase 3
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role?: UserRole
    businessId?: string | null
    subscriptionStatus?: string | null
    isPro?: boolean | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    provider?: string
    role: UserRole
    businessId?: string | null
    subscriptionStatus?: string | null
    isPro?: boolean | null
    impersonatingBusinessId?: string | null  // For Phase 3
  }
}
