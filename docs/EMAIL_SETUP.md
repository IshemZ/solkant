# Configuration de l'Envoi d'Emails - Solkant

Ce document explique comment configurer l'envoi d'emails dans Solkant (vérification email + envoi de devis).

---

## 📧 Fonctionnalités Email

Solkant utilise les emails pour :

1. **✅ Vérification d'email** (IMPLÉMENTÉ)

   - Envoi automatique lors de l'inscription par credentials
   - Token unique valide 24h
   - Blocage d'accès au dashboard sans vérification

2. **Envoi de devis** (Mode simulation actuellement)
   - Envoi de devis PDF aux clients
   - Notification par email

---

## 🧪 Mode Développement (Sans Resend)

Si `RESEND_API_KEY` n'est pas défini, le système fonctionne en **mode simulation** :

- Les emails ne sont PAS envoyés
- Les détails sont affichés dans la console :
  ```
  📧 [MODE SIMULATION] Email de vérification:
     À: user@example.com
     Nom: Marie Dupont
     Token: abc123...
     Lien: http://localhost:3000/verify-email?token=abc123...
  ```
- Copiez le lien de la console pour tester le flow

**⚠️ En production, le mode simulation est désactivé** - vous DEVEZ configurer Resend.

---

## 🔍 Troubleshooting

### L'email n'arrive pas

1. **Vérifier les logs** :

   ```bash
   # En dev, vérifier la console
   npm run dev

   # En production, vérifier Vercel logs
   vercel logs
   ```

2. **Vérifier Resend Dashboard** :

   - Allez sur https://resend.com/emails
   - Consultez le statut de livraison

3. **Problèmes courants** :
   - ❌ Domaine non vérifié → L'email est rejeté
   - ❌ Email dans spam → Configurer SPF/DKIM/DMARC
   - ❌ Rate limit dépassé → Plan gratuit limité à 100/jour

### Token expiré

Les tokens expirent après **24 heures**. Solutions :

1. Se connecter avec l'email (même non vérifié)

[Resend](https://resend.com) est le service d'email recommandé pour Next.js.

### 1. Créer un Compte Resend

1. Allez sur https://resend.com
2. Créez un compte gratuit (100 emails/jour inclus)
3. Ajoutez et vérifiez votre domaine custom
4. Générez une clé API

### 2. Installation

Le package est déjà installé :

```bash
npm install resend  # Déjà fait
```

### 3. Configuration Variables d'Environnement

Ajoutez dans `.env.local` :

```env
# Resend API Key pour envoi d'emails
RESEND_API_KEY=re_votre_cle_api_ici
```

**⚠️ Important** :

- La clé doit commencer par `re_`
- En développement sans cette variable, les emails sont simulés dans la console
- En production, cette variable est **obligatoire** pour la vérification email

### 4. Vérifier votre Domaine

Dans Resend Dashboard :

- Ajoutez votre domaine (ex: `solkant.com`)
- Configurez les DNS records (SPF, DKIM, DMARC)
- Attendez la vérification (~10 minutes)

### 5. Mettre à Jour l'Expéditeur

Dans `lib/email.ts`, modifiez :

```typescript
const EMAIL_CONFIG = {
  from: "Solkant <noreply@votredomaine.com>", // ⚠️ Remplacer
  replyTo: "support@votredomaine.com",
  // ...
};
```

---

## 📋 Architecture du Système de Vérification Email

### Flow Utilisateur

```
1. Inscription (/register)
   ↓
2. API crée User + Business + génère token
   ↓
3. Email envoyé avec lien /verify-email?token=xxx
   ↓
4. Page /check-email affichée
   ↓
5. Utilisateur clique sur le lien dans l'email
   ↓
6. Token vérifié → emailVerified = NOW()
   ↓
7. Redirection /login?verified=true
   ↓
8. Connexion → Accès au dashboard autorisé
```

### Fichiers Impactés

| Fichier                            | Rôle                                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| `prisma/schema.prisma`             | Champs `verificationToken`, `tokenExpiry`, `emailVerified` |
| `lib/email.ts`                     | Service Resend + templates HTML                            |
| `lib/env.ts`                       | Validation `RESEND_API_KEY`                                |
| `app/actions/auth.ts`              | Server Actions pour tokens                                 |
| `app/api/auth/register/route.ts`   | Génération token à l'inscription                           |
| `app/(auth)/verify-email/page.tsx` | Page de validation token                                   |
| `app/(auth)/check-email/page.tsx`  | Page post-inscription                                      |
| `app/(dashboard)/layout.tsx`       | Blocage accès si non vérifié                               |
| `components/auth/RegisterForm.tsx` | Redirection vers /check-email                              |
| `components/auth/LoginForm.tsx`    | Messages vérification                                      |

### Sécurité

✅ **Mesures de sécurité implémentées** :

- Token cryptographiquement sécurisé (32 bytes = 64 caractères hex)
- Expiration 24h
- One-time use (invalidé après utilisation)
- Unique constraint en base
- Rate limiting basique (1 renvoi/heure max)
- Filtrage `businessId` pour multi-tenancy

---

## 🧪 Mode Développement (Sans Resend)

Décommentez le code dans `/app/api/quotes/[id]/send-email/route.ts` :

```typescript
// Remplacer le code de simulation par :
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Générer le PDF
const pdfResponse = await fetch(
  `${process.env.NEXTAUTH_URL}/api/quotes/${id}/pdf`
);
const pdfBlob = await pdfResponse.arrayBuffer();

await resend.emails.send({
  from: `${quote.business.name} <noreply@votredomaine.com>`,
  to: quote.client.email,
  subject: `Devis ${quote.quoteNumber} - ${quote.business.name}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #8B7355;">Bonjour ${quote.client.firstName} ${
    quote.client.lastName
  },</h1>
      
      <p>Veuillez trouver ci-joint votre devis <strong>${
        quote.quoteNumber
      }</strong>.</p>
      
      <div style="background: #f5f5f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Montant total :</strong> ${quote.total.toFixed(
          2
        )} €</p>
        ${
          quote.validUntil
            ? `<p style="margin: 5px 0 0 0;"><strong>Valable jusqu'au :</strong> ${new Date(
                quote.validUntil
              ).toLocaleDateString("fr-FR")}</p>`
            : ""
        }
      </div>
      
      <p>Nous restons à votre disposition pour toute question.</p>
      
      <p>Cordialement,<br/>
      <strong>${quote.business.name}</strong></p>
      
      ${
        quote.business.phone
          ? `<p style="color: #666; font-size: 14px;">📞 ${quote.business.phone}</p>`
          : ""
      }
    </div>
  `,
  attachments: [
    {
      filename: `${quote.quoteNumber}.pdf`,
      content: Buffer.from(pdfBlob),
    },
  ],
});
```

---

## 🔄 Alternatives à Resend

### SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: quote.client.email,
  from: "noreply@votredomaine.com",
  subject: `Devis ${quote.quoteNumber}`,
  html: "...",
  attachments: [
    {
      content: pdfBase64,
      filename: `${quote.quoteNumber}.pdf`,
      type: "application/pdf",
      disposition: "attachment",
    },
  ],
});
```

### Nodemailer (SMTP)

```bash
npm install nodemailer
```

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await transporter.sendMail({
  from: `"${quote.business.name}" <noreply@votredomaine.com>`,
  to: quote.client.email,
  subject: `Devis ${quote.quoteNumber}`,
  html: "...",
  attachments: [
    {
      filename: `${quote.quoteNumber}.pdf`,
      content: pdfBuffer,
    },
  ],
});
```

---

## 📝 Template Email

### Bonnes Pratiques

1. **Subject Line** : Clair et professionnel

   - ✅ `Devis DEVIS-2024-001 - Nom Entreprise`
   - ❌ `Votre devis`

2. **Contenu** :

   - Personnalisé avec le nom du client
   - Résumé du devis (numéro, montant)
   - Coordonnées de l'entreprise
   - Appel à l'action clair

3. **Design** :
   - Responsive (mobile-friendly)
   - Cohérent avec votre marque
   - Simple et professionnel

### Template Avancé (React Email)

Pour des emails plus sophistiqués :

```bash
npm install react-email @react-email/components
```

Créer `emails/QuoteEmail.tsx` :

```tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function QuoteEmail({ quote, client, business }) {
  return (
    <Html>
      <Head />
      <Preview>Votre devis {quote.quoteNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bonjour {client.firstName},</Heading>
          <Text style={text}>
            Veuillez trouver ci-joint votre devis {quote.quoteNumber}.
          </Text>
          {/* ... */}
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 🔒 Sécurité

### Protection Anti-Spam

1. **Rate Limiting** : Limiter à 10 emails/minute par utilisateur
2. **Vérification Email** : Valider les adresses email
3. **DKIM/SPF** : Configurer pour éviter les spams
4. **Unsubscribe** : Ajouter lien de désinscription si besoin

### Exemple Rate Limiting

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

const { success } = await ratelimit.limit(`email_${session.user.id}`);

if (!success) {
  return NextResponse.json(
    { error: "Trop d'emails envoyés. Réessayez dans 1 minute." },
    { status: 429 }
  );
}
```

---

## 📊 Suivi des Emails

### Webhooks Resend

Configurez des webhooks pour suivre :

- ✅ Email envoyé (`email.sent`)
- ✅ Email délivré (`email.delivered`)
- ✅ Email ouvert (`email.opened`)
- ❌ Email bounced (`email.bounced`)

### Stockage Historique

Ajoutez un modèle `EmailLog` dans Prisma :

```prisma
model EmailLog {
  id        String   @id @default(cuid())
  quoteId   String
  quote     Quote    @relation(fields: [quoteId], references: [id])
  recipient String
  status    EmailStatus
  sentAt    DateTime @default(now())
  openedAt  DateTime?

  @@index([quoteId])
}

enum EmailStatus {
  SENT
  DELIVERED
  OPENED
  BOUNCED
  FAILED
}
```

---

## 🧪 Tests

### Test en Local

```bash
# Utiliser MailHog ou Mailpit pour tester localement
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# SMTP_HOST=localhost
# SMTP_PORT=1025
# Interface web : http://localhost:8025
```

### Test en Production

1. Tester avec votre propre email d'abord
2. Vérifier les logs Resend/SendGrid
3. Confirmer la réception du PDF
4. Tester sur mobile et desktop

---

## 📋 Checklist Mise en Production

- [ ] Service d'email configuré (Resend/SendGrid)
- [ ] Clés API ajoutées dans `.env.local`
- [ ] Code décommenté et testé
- [ ] Template email personnalisé
- [ ] SPF/DKIM configurés sur le domaine
- [ ] Rate limiting activé
- [ ] Tests avec emails réels effectués
- [ ] Logs d'erreur configurés (Sentry)
- [ ] Documentation utilisateur mise à jour

---

## 🆘 Dépannage

### Problème : Email non reçu

1. Vérifier les logs du service d'email
2. Vérifier le dossier spam
3. Vérifier que l'adresse email est valide
4. Vérifier les quotas du service (plan gratuit)

### Problème : PDF non attaché

1. Vérifier que l'API `/api/quotes/[id]/pdf` fonctionne
2. Vérifier la taille du PDF (< 10 MB généralement)
3. Vérifier le format de l'attachment

### Problème : Rate limit atteint

1. Passer à un plan payant
2. Optimiser le nombre d'envois
3. Implémenter une file d'attente (queue)

---

**Mainteneur** : Backend & Integration Specialist  
**Dernière mise à jour** : 1er décembre 2025
