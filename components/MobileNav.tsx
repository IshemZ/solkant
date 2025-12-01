'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import SignOutButton from './SignOutButton'

interface MobileNavProps {
  userName?: string | null
  userEmail?: string | null
}

export default function MobileNav({ userName, userEmail }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/dashboard/devis/nouveau', label: 'Nouveau devis', primary: true },
    { href: '/dashboard/devis', label: 'Mes devis' },
    { href: '/dashboard/clients', label: 'Clients' },
    { href: '/dashboard/services', label: 'Services' },
    { href: '/dashboard/parametres', label: 'Paramètres' },
  ]

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-foreground/20 md:hidden"
          aria-label="Ouvrir le menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-foreground/10 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=closed]:duration-300 data-[state=open]:duration-300">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Dialog.Title className="text-xl font-bold text-foreground">
                Menu
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded-md p-2 text-foreground/60 hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  aria-label="Fermer le menu"
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

            {/* User Info */}
            <div className="mb-6 rounded-lg border border-foreground/10 bg-foreground/5 p-4">
              <p className="text-sm font-medium text-foreground">
                {userName || userEmail}
              </p>
              {userName && userEmail && (
                <p className="text-xs text-foreground/60">{userEmail}</p>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={
                      link.primary
                        ? 'flex items-center gap-3 rounded-md bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90'
                        : isActive
                        ? 'flex items-center gap-3 rounded-md bg-foreground/10 px-4 py-3 text-sm font-semibold text-foreground transition-colors'
                        : 'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground'
                    }
                  >
                    {link.primary && (
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Sign Out Button */}
            <div className="mt-6 pt-6 border-t border-foreground/10">
              <SignOutButton />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
