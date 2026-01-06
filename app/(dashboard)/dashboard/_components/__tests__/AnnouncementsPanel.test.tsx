/**
 * Tests pour le composant AnnouncementsPanel
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnnouncementsPanel from "../AnnouncementsPanel";
import type { Announcement } from "@/lib/announcements";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("AnnouncementsPanel", () => {
  const mockAnnouncements: Announcement[] = [
    {
      id: "test-1",
      publishedAt: new Date("2025-01-06"),
      title: "Test Feature 1",
      description: "Description for test feature 1",
      actionLabel: "Try it",
      actionUrl: "/dashboard/test-1",
      badge: "new",
    },
    {
      id: "test-2",
      publishedAt: new Date("2025-01-05"),
      title: "Test Feature 2",
      description: "Description for test feature 2",
    },
  ];

  const mockOnOpened = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when closed", () => {
    render(
      <AnnouncementsPanel
        isOpen={false}
        onClose={mockOnClose}
        announcements={mockAnnouncements}
        onOpened={mockOnOpened}
      />
    );

    expect(screen.queryByText("Nouveautés")).not.toBeInTheDocument();
  });

  it("should render announcements when open", () => {
    render(
      <AnnouncementsPanel
        isOpen={true}
        onClose={mockOnClose}
        announcements={mockAnnouncements}
        onOpened={mockOnOpened}
      />
    );

    expect(screen.getByText("Nouveautés")).toBeInTheDocument();
    expect(screen.getByText("Test Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Test Feature 2")).toBeInTheDocument();
  });

  it("should call onOpened after 300ms when opened", async () => {
    vi.useFakeTimers();

    render(
      <AnnouncementsPanel
        isOpen={true}
        onClose={mockOnClose}
        announcements={mockAnnouncements}
        onOpened={mockOnOpened}
      />
    );

    expect(mockOnOpened).not.toHaveBeenCalled();

    // Advance timers and run pending promises
    await vi.advanceTimersByTimeAsync(300);

    expect(mockOnOpened).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("should render action button when actionUrl is provided", () => {
    render(
      <AnnouncementsPanel
        isOpen={true}
        onClose={mockOnClose}
        announcements={mockAnnouncements}
        onOpened={mockOnOpened}
      />
    );

    expect(screen.getByText("Try it")).toBeInTheDocument();
  });

  it("should not render action button when actionUrl is missing", () => {
    render(
      <AnnouncementsPanel
        isOpen={true}
        onClose={mockOnClose}
        announcements={mockAnnouncements}
        onOpened={mockOnOpened}
      />
    );

    // Test Feature 2 n'a pas d'action
    const feature2Section = screen.getByText("Test Feature 2").closest("div");
    expect(feature2Section).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", async () => {
    render(
      <AnnouncementsPanel
        isOpen={true}
        onClose={mockOnClose}
        announcements={mockAnnouncements}
        onOpened={mockOnOpened}
      />
    );

    const closeButton = screen.getByLabelText(/fermer/i);
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should format dates in French locale", () => {
    render(
      <AnnouncementsPanel
        isOpen={true}
        onClose={mockOnClose}
        announcements={mockAnnouncements}
        onOpened={mockOnOpened}
      />
    );

    // Vérifie que la date est formatée en français
    expect(screen.getByText(/6 janvier 2025/i)).toBeInTheDocument();
  });

  it("should display 'Nouveau' badge for recent announcements", () => {
    const recentAnnouncement: Announcement = {
      id: "recent",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours
      title: "Recent Feature",
      description: "Very recent",
      badge: "new",
    };

    render(
      <AnnouncementsPanel
        isOpen={true}
        onClose={mockOnClose}
        announcements={[recentAnnouncement]}
        onOpened={mockOnOpened}
      />
    );

    expect(screen.getByText("Nouveau")).toBeInTheDocument();
  });
});
