import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton
 *
 * This ensures we only have one instance of PrismaClient in development
 * to avoid hitting connection limits during hot reloading.
 *
 * Prisma 7: datasourceUrl is passed to the constructor instead of schema file
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
