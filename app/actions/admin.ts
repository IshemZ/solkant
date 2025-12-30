"use server";

import { withSuperAdminAuth } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionStatus } from "@prisma/client";

/**
 * Get all businesses (super admin only)
 * No businessId filter - super admin sees ALL businesses
 */
export const getAllBusinesses = withSuperAdminAuth(
  async (_input: void, _session) => {
    const businesses = await prisma.business.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            clients: true,
            quotes: true,
            services: true,
            packages: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResult(businesses);
  },
  "getAllBusinesses"
);

/**
 * Get detailed info for a specific business (super admin only)
 */
export const getBusinessDetails = withSuperAdminAuth(
  async (input: { businessId: string }, _session) => {
    const business = await prisma.business.findUnique({
      where: { id: input.businessId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            createdAt: true,
            image: true
          }
        },
        clients: { select: { id: true, firstName: true, lastName: true } },
        quotes: { select: { id: true, status: true, total: true } },
        services: { select: { id: true, name: true } },
        packages: { select: { id: true, name: true } }
      }
    });

    if (!business) {
      throw new Error("Business introuvable");
    }

    return successResult(business);
  },
  "getBusinessDetails"
);

/**
 * Update business data (super admin only)
 */
export const updateBusinessAsAdmin = withSuperAdminAuth(
  async (input: {
    businessId: string;
    data: {
      name?: string;
      address?: string;
      rue?: string;
      ville?: string;
      codePostal?: string;
      phone?: string;
      email?: string;
      subscriptionStatus?: SubscriptionStatus;
      isPro?: boolean;
    }
  }, _session) => {
    const business = await prisma.business.update({
      where: { id: input.businessId },
      data: input.data
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/businesses/${input.businessId}`);

    return successResult(business);
  },
  "updateBusinessAsAdmin"
);

/**
 * Toggle business status (suspend/activate)
 */
export const toggleBusinessStatus = withSuperAdminAuth(
  async (input: {
    businessId: string;
    suspended: boolean
  }, _session) => {
    const business = await prisma.business.update({
      where: { id: input.businessId },
      data: {
        subscriptionStatus: input.suspended ? 'CANCELED' : 'ACTIVE'
      }
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/businesses/${input.businessId}`);

    return successResult(business);
  },
  "toggleBusinessStatus"
);

/**
 * Delete business (with cascade)
 */
export const deleteBusinessAsAdmin = withSuperAdminAuth(
  async (input: { businessId: string }, _session) => {
    // Cascade delete configured in schema.prisma
    await prisma.business.delete({
      where: { id: input.businessId }
    });

    revalidatePath('/admin');

    return successResult({ id: input.businessId });
  },
  "deleteBusinessAsAdmin"
);
