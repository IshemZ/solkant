'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
    >
      Déconnexion
    </button>
  )
}
