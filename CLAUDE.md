# CLAUDE.md (Main Overview)

Ce fichier donne une vue d'ensemble de Devisio et pointe vers les documents complémentaires.

> **IMPORTANT pour Claude Code**: Tous les fichiers `.md` listés ci-dessous font partie du contexte permanent du projet. Lors de chaque session, consulter ces fichiers pour comprendre l'architecture, les workflows, les priorités et les conventions du projet.

## 📘 Fichiers de documentation (Contexte Permanent)

- [`ARCHITECTURE.md`](ARCHITECTURE.md) – Structure du projet, conventions, stack technique
- [`WORKFLOW.md`](WORKFLOW.md) – Flux de travail Git, commandes, déploiement
- [`UX.md`](UX.md) – Audit UX, recommandations et roadmap UI
- [`ROADMAP.md`](ROADMAP.md) – Tâches prioritaires, TODOs, avancement
- [`VALIDATION.md`](VALIDATION.md) – Validation des entrées, sécurité, Zod
- [`AUTH.md`](AUTH.md) – Auth.js, OAuth, gestion de session

---

## Projet Devisio – Vue d'ensemble

**Nom** : Devisio  
**Description** :  
Devisio est une plateforme SaaS conçue pour les instituts de beauté afin de faciliter la création de devis professionnels. Elle permet de générer rapidement des PDF personnalisés, de gérer les clients et services, le tout avec une interface élégante.

**Objectifs principaux** :

- Générer instantanément des devis PDF avec branding
- Maintenir une esthétique raffinée (tons beiges, design épuré)
- Outils intuitifs pour gérer les clients et les prestations
- Optimisation desktop-first avec interactions fluides

**Utilisateurs cibles** :

- Gérants d'instituts ou salons de beauté (indépendants)
- Besoin d'un outil simple et professionnel, sans complexité d'un ERP

## Stack Technique

- **Framework** : Next.js 16.0.4 (App Router)
- **React** : v19.2.0
- **TypeScript** : v5 (strict mode activé)
- **Styling** : Tailwind CSS v4 + PostCSS
- **Fonts** : Geist Sans et Geist Mono via `next/font/google`
- **Base de données** : Supabase (PostgreSQL)
- **ORM** : Prisma v6 (6.19.0)
- **Auth** : NextAuth (Auth.js v5)

> 🛠️ Pour les détails sur l'architecture technique, voir [`ARCHITECTURE.md`](ARCHITECTURE.md)
> 🔐 Pour la configuration d'authentification, voir [`AUTH.md`](AUTH.md)
> 🧪 Pour la validation des données, voir [`VALIDATION.md`](VALIDATION.md)
