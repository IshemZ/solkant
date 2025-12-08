import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { getEnv, features } from "./env";

/**
 * NextAuth configuration
 *
 * This file contains all NextAuth settings including:
 * - Authentication providers (Credentials, Google OAuth)
 * - Session strategy
 * - Callbacks for JWT and session handling
 *
 * ARCHITECTURE: Lazy evaluation pattern pour éviter validation prématurée
 */

// ❌ ÉVITER: const env = getEnv(); // Exécuté au module load time
// ✅ PATTERN: Fonction factory qui évalue getEnv() à la runtime

function buildProviders(): NextAuthOptions["providers"] {
  const env = getEnv(); // ✅ Évalué uniquement quand appelé

  const providers: NextAuthOptions["providers"] = [
    // Email/Password authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ];

  // Add Google OAuth only if credentials are available
  if (features.googleOAuth) {
    providers.push(
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      })
    );
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  // Adapter disabled for JWT strategy - accounts/sessions managed via JWT
  // adapter: PrismaAdapter(prisma),

  // ✅ PATTERN: Lazy evaluation via getter
  get providers() {
    return buildProviders();
  },

  // Use JWT strategy for sessions
  session: {
    strategy: "jwt",
  },

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },

  // Callbacks
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth: create User and Business if they don't exist
      if (account?.provider === "google" && user.email) {
        try {
          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { business: true },
          });

          // Create user if doesn't exist
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || undefined,
                image: user.image || undefined,
                emailVerified: new Date(),
              },
              include: { business: true },
            });
          }

          // Create Business if doesn't exist
          if (!dbUser.business) {
            await prisma.business.create({
              data: {
                name: `Institut de ${user.name || "beauté"}`,
                userId: dbUser.id,
                email: user.email || undefined,
              },
            });
          }

          // Update user.id with database ID for JWT token
          user.id = dbUser.id;
        } catch (error) {
          console.error(
            "[Google OAuth] ERREUR dans le callback signIn:",
            error
          );
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      try {
        // Initial sign in
        if (user) {
          token.id = user.id;

          // Fetch businessId for the user
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { business: { select: { id: true } } },
          });

          token.businessId = dbUser?.business?.id || null;

          if (!token.businessId) {
            console.warn(
              "[JWT Callback] ⚠️ Aucun businessId trouvé pour user:",
              user.id
            );
          }
        }

        // OAuth sign in
        if (account?.provider === "google") {
          token.provider = "google";
        }

        return token;
      } catch (error) {
        console.error("[JWT Callback] ERREUR:", error);
        throw error; // Re-throw pour que NextAuth gère l'erreur proprement
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.businessId = token.businessId as string | null;
      }
      return session;
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",

  // Secret for JWT encryption - lazy evaluation
  get secret() {
    return getEnv().NEXTAUTH_SECRET;
  },
};
