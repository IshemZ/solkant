import 'next-auth'

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
      businessId?: string | null
      subscriptionStatus?: string | null
      isPro?: boolean | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    businessId?: string | null
    subscriptionStatus?: string | null
    isPro?: boolean | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    provider?: string
    businessId?: string | null
    subscriptionStatus?: string | null
    isPro?: boolean | null
  }
}
