# Exemples d'utilisation des schémas de validation

Ce fichier contient des exemples pratiques d'utilisation des schémas de validation Zod dans différents contextes.

## 📝 Table des matières

1. [Server Actions (Next.js 15+)](#server-actions-nextjs-15)
2. [API Routes](#api-routes)
3. [Validation côté client](#validation-côté-client)
4. [Gestion des erreurs](#gestion-des-erreurs)

---

## Server Actions (Next.js 15+)

### Exemple : Créer un client

```typescript
'use server'

import { createClientSchema, type CreateClientInput } from '@/lib/validations'
import { prisma } from '@/lib/prisma'
import { getBusinessId } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function createClientAction(data: CreateClientInput) {
  try {
    // 1. Valider les données
    const validated = createClientSchema.parse(data)

    // 2. Récupérer le businessId depuis la session
    const businessId = await getBusinessId()

    // 3. Créer le client dans la base de données
    const client = await prisma.client.create({
      data: {
        ...validated,
        businessId,
      },
    })

    // 4. Revalider le cache
    revalidatePath('/dashboard/clients')

    return { success: true, data: client }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten() }
    }
    return { success: false, error: 'Une erreur est survenue' }
  }
}
```

### Exemple : Mettre à jour un devis

```typescript
'use server'

import { updateQuoteSchema, type UpdateQuoteInput } from '@/lib/validations'
import { prisma } from '@/lib/prisma'
import { getBusinessId } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function updateQuoteAction(quoteId: string, data: UpdateQuoteInput) {
  try {
    // 1. Valider les données
    const validated = updateQuoteSchema.parse(data)

    // 2. Récupérer le businessId depuis la session
    const businessId = await getBusinessId()

    // 3. Vérifier que le devis appartient bien au business
    const existingQuote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        businessId,
      },
    })

    if (!existingQuote) {
      return { success: false, error: 'Devis introuvable' }
    }

    // 4. Calculer les totaux si items fournis
    let updateData = { ...validated }

    if (validated.items) {
      const subtotal = validated.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      const total = subtotal - (validated.discount || existingQuote.discount)

      updateData = {
        ...validated,
        subtotal,
        total,
      }

      // Supprimer les anciens items et créer les nouveaux
      await prisma.quoteItem.deleteMany({
        where: { quoteId },
      })
    }

    // 5. Mettre à jour le devis
    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        ...updateData,
        items: validated.items
          ? {
              create: validated.items.map((item) => ({
                ...item,
                total: item.price * item.quantity,
              })),
            }
          : undefined,
      },
      include: {
        items: true,
        client: true,
      },
    })

    // 6. Revalider le cache
    revalidatePath('/dashboard/quotes')
    revalidatePath(`/dashboard/quotes/${quoteId}`)

    return { success: true, data: quote }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten() }
    }
    return { success: false, error: 'Une erreur est survenue' }
  }
}
```

---

## API Routes

### Exemple : Route POST pour créer un service

```typescript
// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceSchema } from '@/lib/validations'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // 2. Parser le body
    const body = await req.json()

    // 3. Valider avec safeParse
    const result = createServiceSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }

    // 4. Créer le service
    const service = await prisma.service.create({
      data: {
        ...result.data,
        businessId: session.user.businessId,
      },
    })

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
```

---

## Validation côté client

### Avec formulaire contrôlé React

```typescript
'use client'

import { useState } from 'react'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation côté client
    const result = loginSchema.safeParse(formData)

    if (!result.success) {
      // Convertir les erreurs Zod en format simple
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    // Envoyer les données validées
    const response = await signIn('credentials', {
      ...result.data,
      redirect: false,
    })

    if (response?.error) {
      setErrors({ general: 'Email ou mot de passe invalide' })
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && <div className="error">{errors.general}</div>}

      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label>Mot de passe</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit">Se connecter</button>
    </form>
  )
}
```

### Avec React Hook Form (optionnel)

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validations'

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    // Les données sont déjà validées par Zod
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    // Gérer la réponse...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nom</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label>Email</label>
        <input {...register('email')} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Mot de passe</label>
        <input {...register('password')} type="password" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>Confirmer le mot de passe</label>
        <input {...register('confirmPassword')} type="password" />
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  )
}
```

---

## Gestion des erreurs

### Formater les erreurs Zod pour l'affichage

```typescript
import { z } from 'zod'

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {}

  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    formattedErrors[path] = issue.message
  })

  return formattedErrors
}

// Utilisation
try {
  createClientSchema.parse(data)
} catch (error) {
  if (error instanceof z.ZodError) {
    const errors = formatZodErrors(error)
    console.log(errors)
    // { email: "Format d'email invalide", phone: "Numéro de téléphone invalide" }
  }
}
```

### Erreurs flatten (recommandé)

```typescript
const result = createClientSchema.safeParse(data)

if (!result.success) {
  const errors = result.error.flatten()
  console.log(errors.fieldErrors)
  // {
  //   email: ["Format d'email invalide"],
  //   phone: ["Numéro de téléphone invalide"]
  // }
}
```

---

## 🔐 Bonnes pratiques de sécurité

1. **TOUJOURS valider côté serveur** même avec validation client
2. **Utiliser `.parse()` dans les Server Actions** pour lever des erreurs
3. **Utiliser `.safeParse()` dans les API Routes** pour gérer les erreurs gracieusement
4. **Ne jamais faire confiance aux données non validées**
5. **Toujours vérifier l'authentification AVANT la validation**
6. **Toujours filtrer par `businessId` pour la sécurité multi-tenant**

---

*Pour plus d'informations, voir [README.md](./README.md) et [VALIDATION.md](../../VALIDATION.md)*
