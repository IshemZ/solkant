import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Composants async pour fetching de données
async function QuotesCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) return <span>0</span>;

  const count = await prisma.quote.count({
    where: { businessId: session.user.businessId },
  });

  return <span>{count}</span>;
}

async function ClientsCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) return <span>0</span>;

  const count = await prisma.client.count({
    where: { businessId: session.user.businessId },
  });

  return <span>{count}</span>;
}

async function ServicesCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) return <span>0</span>;

  const count = await prisma.service.count({
    where: { businessId: session.user.businessId },
  });

  return <span>{count}</span>;
}

async function RevenueTotal() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) return <span>0€</span>;

  const result = await prisma.quote.aggregate({
    where: {
      businessId: session.user.businessId,
      status: "ACCEPTED",
    },
    _sum: {
      total: true,
    },
  });

  const total = result._sum.total || 0;
  return <span>{total.toFixed(0)}€</span>;
}

// Skeleton fallbacks
function StatSkeleton() {
  return (
    <span className="inline-block h-9 w-16 animate-pulse rounded bg-foreground/10" />
  );
}

// Composant principal avec Suspense
export function DashboardStats() {
  return (
    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Devis */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground/60">Devis</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              <Suspense fallback={<StatSkeleton />}>
                <QuotesCount />
              </Suspense>
            </p>
          </div>
          <div className="rounded-full bg-foreground/10 p-3">
            <svg
              className="h-6 w-6 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Clients */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground/60">Clients</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              <Suspense fallback={<StatSkeleton />}>
                <ClientsCount />
              </Suspense>
            </p>
          </div>
          <div className="rounded-full bg-foreground/10 p-3">
            <svg
              className="h-6 w-6 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground/60">Services</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              <Suspense fallback={<StatSkeleton />}>
                <ServicesCount />
              </Suspense>
            </p>
          </div>
          <div className="rounded-full bg-foreground/10 p-3">
            <svg
              className="h-6 w-6 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="rounded-lg border border-foreground/10 bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground/60">
              Chiffre d&apos;affaires
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              <Suspense fallback={<StatSkeleton />}>
                <RevenueTotal />
              </Suspense>
            </p>
          </div>
          <div className="rounded-full bg-foreground/10 p-3">
            <svg
              className="h-6 w-6 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
