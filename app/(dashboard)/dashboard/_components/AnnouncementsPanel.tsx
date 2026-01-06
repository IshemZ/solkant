"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import type { Announcement } from "@/lib/announcements";

interface AnnouncementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  onOpened: () => void;
}

export default function AnnouncementsPanel({
  isOpen,
  onClose,
  announcements,
  onOpened,
}: AnnouncementsPanelProps) {
  // Marquer comme vu après 300ms d'ouverture
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onOpened();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onOpened]);

  // Détermine si une annonce est récente (publiée dans les 7 derniers jours)
  const isRecent = (publishedAt: Date): boolean => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return publishedAt > sevenDaysAgo;
  };

  // Formate une date en français
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-foreground/10 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Nouveautés
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Découvrez les dernières fonctionnalités ajoutées à Solkant
              </Dialog.Description>
              <Dialog.Close asChild>
                <button
                  className="rounded-md p-2 text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  aria-label="Fermer"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Dialog.Close>
            </div>

            {/* Content - Liste des annonces */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4"
                  >
                    {/* Badge "Nouveau" si récent */}
                    {announcement.badge === "new" && isRecent(announcement.publishedAt) && (
                      <span className="mb-2 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Nouveau
                      </span>
                    )}

                    {/* Titre */}
                    <h3 className="mb-1 font-semibold text-foreground">
                      {announcement.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-3 text-sm text-muted-foreground">
                      {announcement.description}
                    </p>

                    {/* Date */}
                    <p className="mb-3 text-xs text-muted-foreground">
                      {formatDate(announcement.publishedAt)}
                    </p>

                    {/* Bouton d'action */}
                    {announcement.actionUrl && announcement.actionLabel && (
                      <Link
                        href={announcement.actionUrl}
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                      >
                        {announcement.actionLabel}
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
