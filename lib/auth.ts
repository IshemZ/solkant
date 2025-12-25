import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { getEnv, features } from "./env";
import * as Sentry from "@sentry/nextjs";

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
        let retries = 3;
        let lastError: Error | null = null;

        // ✅ RETRY LOGIC: Tenter jusqu'à 3 fois en cas d'erreur transitoire
        while (retries > 0) {
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

              console.log(`✅ [Google OAuth] Utilisateur créé: ${dbUser.id}`);
            }

            // Create Business if doesn't exist (avec transaction pour atomicité)
            if (!dbUser.business) {
              await prisma.$transaction(async (tx) => {
                const business = await tx.business.create({
                  data: {
                    name: `Institut de ${user.name || "beauté"}`,
                    userId: dbUser!.id,
                    email: user.email || undefined,
                  },
                });

                console.log(
                  `✅ [Google OAuth] Business créé: ${business.id} pour user: ${
                    dbUser!.id
                  }`
                );
              });

              // Recharger l'utilisateur avec le Business
              dbUser = await prisma.user.findUnique({
                where: { id: dbUser.id },
                include: { business: true },
              });
            }

            // Update user.id with database ID for JWT token
            user.id = dbUser!.id;

            console.log(
              `✅ [Google OAuth] SignIn réussi pour: ${
                user.email
              }, businessId: ${dbUser!.business?.id}`
            );

            return true;
          } catch (error) {
            lastError = error as Error;
            retries--;

            console.error(
              `[Google OAuth] ❌ ERREUR (${3 - retries}/3):`,
              error
            );

            // Erreurs transitoires: DB timeout, connection issues
            const isTransientError =
              error instanceof Error &&
              (error.message.includes("timeout") ||
                error.message.includes("connection") ||
                error.message.includes("ECONNREFUSED") ||
                error.message.includes("ETIMEDOUT"));

            // Si erreur non-transitoire ou plus de retries, abandonner
            if (!isTransientError || retries === 0) {
              console.error(
                "[Google OAuth] ❌ Échec définitif après retries:",
                lastError
              );

              // Logger dans Sentry pour monitoring
              Sentry.captureException(lastError, {
                tags: {
                  action: "google_oauth_signin",
                  provider: "google",
                },
                extra: {
                  email: user.email,
                  retries: 3 - retries,
                },
              });

              return false;
            }

            // Attendre avant de réessayer (exponential backoff)
            const delay = (4 - retries) * 500; // 500ms, 1000ms, 1500ms
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        return false;
      }

      return true;
    },

    async jwt({ token, user, account }) {
      try {
        // Initial sign in
        if (user) {
          token.id = user.id;

          // Fetch businessId and subscription info for the user
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              business: {
                select: {
                  id: true,
                  subscriptionStatus: true,
                  isPro: true,
                },
              },
            },
          });

          token.businessId = dbUser?.business?.id || null;
          token.subscriptionStatus =
            dbUser?.business?.subscriptionStatus || null;
          token.isPro = dbUser?.business?.isPro || null;

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
        session.user.subscriptionStatus =
          token.subscriptionStatus as string | null;
        session.user.isPro = token.isPro as boolean | null;
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
