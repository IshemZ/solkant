# 🚀 Guide Rapide GA4 - Solkant

**Pour** : Équipe Marketing & Produit
**Objectif** : Accès rapide aux rapports clés et interprétation des métriques
**Dernière mise à jour** : 2025-12-25

---

## 📊 Rapports Clés - Accès Rapide

### 1. Dashboard Acquisition SEO (Consultation Hebdomadaire)

**Où le trouver :**
GA4 → Explore (menu gauche) → "Dashboard Acquisition SEO Hebdomadaire"

**Ce qu'il montre :**
- Nombre de sessions organiques par semaine
- Nombre d'inscriptions (conversions `sign_up`)
- Taux de conversion SEO (%)
- Temps d'engagement moyen
- Taux de rebond

**Comment l'interpréter :**

| Métrique | Bon signe | Mauvais signe | Action |
|----------|-----------|---------------|--------|
| **Sessions organiques** | Croissance >10%/semaine | Baisse >20% | Vérifier Search Console, indexation |
| **Inscriptions** | Croissance constante | Stagnation ou baisse | Analyser funnel d'inscription |
| **Taux de conversion** | >2% | <1% | Optimiser pages de destination |
| **Engagement time** | >45s sur marketing | <30s | Améliorer contenu, UX |
| **Bounce rate** | <60% | >80% | Problème pertinence ou UX |

**Alerte rouge** 🚨 : Si inscriptions < 5/semaine → investiguer immédiatement

---

### 2. Funnel d'Acquisition (Consultation Mensuelle)

**Où le trouver :**
GA4 → Explore → "Funnel Inscription Complet"

**Ce qu'il montre :**
Le parcours complet de l'inscription avec les taux de drop-off :

```
100% - Visiteurs pages marketing/blog
 ↓
~15% - Cliquent sur CTA "S'inscrire"
 ↓
~70% - Arrivent sur page d'inscription
 ↓
~50% - Commencent à remplir le formulaire
 ↓
~60% - Finalisent l'inscription ✅
```

**Comment l'interpréter :**

Si la plus grosse perte est à l'étape :

1. **Click CTA → Page inscription (>40% perte)** : Problème technique (lien cassé ?) ou trop de friction
2. **Vue page → Début formulaire (>50% perte)** : Page d'inscription peu engageante, manque de clarté
3. **Début formulaire → Inscription finalisée (>50% perte)** : Formulaire trop complexe, erreurs validation

**Action :** Optimiser l'étape avec la plus grosse perte en priorité

---

### 3. Performance des Contenus SEO (Consultation Mensuelle)

**Où le trouver :**
GA4 → Explore → "Top Contenus SEO Convertissants"

**Ce qu'il montre :**
Classement des articles de blog et pages SEO par :
- Trafic organique généré
- Taux de conversion (inscriptions / sessions)
- Engagement (scroll, temps passé)

**Comment l'utiliser :**

**Top 3 pages avec le meilleur taux de conversion** → Promouvoir ces contenus :
- Liens internes depuis homepage
- Partage réseaux sociaux
- Optimisation SEO supplémentaire (backlinks)

**Pages avec fort trafic mais faible conversion (<1%)** → Améliorer :
- Ajouter CTA plus visibles
- Clarifier proposition de valeur
- Vérifier cohérence requête SEO ↔ contenu

**Pages avec faible trafic mais forte conversion (>5%)** → Opportunité :
- Créer plus de contenus similaires
- Optimiser SEO pour augmenter le trafic

---

### 4. Analyse des Erreurs d'Inscription (Consultation Hebdomadaire)

**Où le trouver :**
GA4 → Explore → "Diagnostic Erreurs Inscription"

**Ce qu'il montre :**
Répartition des types d'erreurs lors des tentatives d'inscription :
- `email_exists` : Email déjà utilisé
- `validation_failed` : Mot de passe invalide, champs manquants
- `server_error` : Erreur technique serveur
- `oauth_failed` : Échec Google OAuth

**Seuils d'alerte :**

| Type d'erreur | Normal | ⚠️ Attention | 🚨 Urgent |
|---------------|--------|-------------|----------|
| `email_exists` | <5% | 5-10% | >10% |
| `validation_failed` | <10% | 10-20% | >20% |
| `server_error` | <2% | 2-5% | >5% |
| `oauth_failed` | <5% | 5-10% | >10% |

**Actions par type d'erreur :**

- **email_exists dominant** : Améliorer message + lien "Mot de passe oublié ?"
- **validation_failed dominant** : Revoir règles de validation (trop strictes ?)
- **server_error ou oauth_failed** : Problème technique → vérifier Sentry, contacter dev

---

## 📈 Métriques Clés - Définitions Simples

### KPI Primaire

**Inscriptions mensuelles** (`sign_up`)
- **Définition** : Nombre de comptes créés dans le mois
- **Cible** : 20/mois (3 premiers mois), 50+/mois (après 6 mois)
- **Où la trouver** : GA4 → Rapports → Engagement → Conversions

### KPI Secondaire

**Taux de conversion SEO**
- **Formule** : (Inscriptions organiques / Sessions organiques) × 100
- **Cible** : 2-5%
- **Benchmark SaaS B2B** : 2-5% est bon, >5% est excellent
- **Où la trouver** : Dashboard Acquisition SEO (calculé automatiquement)

### Métriques de Support

**Sessions organiques**
- **Définition** : Visites provenant de Google (recherche)
- **Cible** : 1000+/mois
- **Où la trouver** : GA4 → Rapports → Acquisition → Trafic

**Taux de rebond (Bounce Rate)**
- **Définition** : % de visiteurs qui quittent sans interagir (< 10s sur page)
- **Bon** : <60% sur pages marketing
- **Mauvais** : >80% (signale problème UX ou pertinence)

**Temps d'engagement moyen (Avg Engagement Time)**
- **Définition** : Temps moyen passé en interaction active
- **Bon** : >45s sur pages marketing, >2min sur blog
- **Mauvais** : <30s

---

## 🔍 Cas d'Usage Fréquents

### "Combien d'inscriptions cette semaine ?"

1. GA4 → Rapports → Temps réel (si aujourd'hui)
2. OU Explore → "Dashboard Acquisition SEO" (dernière semaine complète)
3. Regarder colonne "Conversions (sign_up)"

### "Quelle page de blog convertit le mieux ?"

1. GA4 → Explore → "Performance des Contenus SEO"
2. Trier par "Taux de conversion" décroissant
3. Top 1 = page la plus performante

### "Pourquoi les inscriptions ont chuté cette semaine ?"

**Étapes de diagnostic :**

1. **Vérifier le trafic** :
   - Dashboard Acquisition SEO → Sessions organiques en baisse ?
   - Si oui → Problème SEO (vérifier Search Console)
   - Si non → Problème de conversion

2. **Vérifier le funnel** :
   - Funnel Inscription → Quelle étape a le plus gros drop-off ?
   - Comparer avec semaine précédente

3. **Vérifier les erreurs** :
   - Diagnostic Erreurs Inscription → Pic d'erreurs serveur ?
   - Si oui → Problème technique (contacter dev)

4. **Vérifier les événements trackés** :
   - GA4 → DebugView (activer `?debug_mode=true` sur site)
   - Événements `sign_up` toujours envoyés ?

### "Quel CTA génère le plus de clics ?"

1. GA4 → Rapports → Engagement → Événements
2. Chercher événement `click_cta_register`
3. Ajouter dimension "cta_location" (custom dimension)
4. Trier par nombre d'événements décroissant
5. Top 1 = CTA le plus cliqué

---

## ⚠️ Quand S'Inquiéter (Seuils d'Alerte)

### 🚨 Alerte Critique (Action immédiate)

- Inscriptions < 5 par semaine (vs cible 20/mois)
- Taux d'erreur inscription > 20%
- Trafic organique -70% sur 7 jours
- Taux de conversion < 0,5% (divisé par 4)

**Action** : Contacter immédiatement l'équipe technique

### ⚠️ Alerte Moyenne (Investiguer sous 48h)

- Inscriptions -30% vs semaine précédente
- Taux de rebond > 80% sur homepage
- Taux d'erreur inscription 10-20%
- Temps d'engagement < 30s sur pages marketing

**Action** : Analyser les causes, planifier optimisations

### ℹ️ Alerte Basse (Surveiller)

- Inscriptions stagnantes (pas de croissance)
- Taux de conversion 1-2% (objectif mais pas excellent)
- Une page de blog avec bounce rate > 70%

**Action** : Suivre l'évolution, tester des améliorations

---

## 🛠️ Qui Contacter

### Problème Technique (événements non trackés, erreurs serveur)

**Contact** : Équipe Dev
**Informations à fournir** :
- Capture d'écran du rapport GA4
- Date/heure du problème
- Nombre d'utilisateurs affectés

### Problème SEO (chute trafic organique)

**Contact** : Équipe Marketing/SEO
**Informations à fournir** :
- Dashboard Acquisition SEO (dernières 4 semaines)
- Top 10 landing pages avant/après
- Export Search Console si possible

### Problème UX/Conversion (funnel bloqué)

**Contact** : Équipe Produit
**Informations à fournir** :
- Funnel Inscription (capture d'écran)
- Étape avec plus gros drop-off
- Période affectée

---

## 📚 Ressources Complémentaires

**Documentation Complète :**
- [Plan de Mesure](./measurement-plan.md) - Objectifs et KPIs détaillés
- [Solution Design Reference](./solution-design-reference.md) - Spécifications techniques événements

**Accès GA4 :**
- URL : [https://analytics.google.com](https://analytics.google.com)
- Propriété : Solkant Production
- Identifiant : `G-XXXXXXXXXX` (voir variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`)

**Formation GA4 (gratuit) :**
- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)
- Cours recommandé : "Google Analytics 4 Fundamentals"

---

**Mise à jour** : 2025-12-25
**Questions** : Contacter l'équipe Data/Analytics
