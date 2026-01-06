"use server";

import { withAuth } from "@/lib/action-wrapper";
import { successResult } from "@/lib/action-types";
import prisma from "@/lib/prisma";

/**
 * Marks all announcements as seen by updating the user's lastSeenAnnouncementsAt timestamp
 */
export const markAnnouncementsAsSeen = withAuth(
  async (_input: Record<string, never>, session) => {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        lastSeenAnnouncementsAt: new Date(),
      },
      select: {
        lastSeenAnnouncementsAt: true,
      },
    });

    return successResult(updatedUser);
  },
  "markAnnouncementsAsSeen"
);
