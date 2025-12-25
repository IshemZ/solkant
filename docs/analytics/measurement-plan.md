# 📊 Plan de Mesure - Solkant

**Version** : 1.0
**Date de création** : 2025-12-25
**Propriétaire** : Équipe Solkant
**Objectif** : Définir la stratégie de mesure pour l'acquisition SEO organique

---

## 1. Objectif Stratégique et KPIs Primaires

### Objectif Business Principal

**Augmenter le nombre d'utilisateurs inscrits via le canal SEO organique** (sans publicité payante).

### Hypothèse de Croissance

Les professionnels des salons de beauté cherchent activement sur Google des solutions de gestion de devis. En capturant ce trafic organique via un contenu SEO optimisé (blog, guides) et en optimisant le tunnel d'inscription, Solkant peut acquérir des utilisateurs qualifiés à coût zéro.

### KPI Primaire (North Star Metric)

**Nombre de comptes créés par mois** (événement `sign_up`)

- **Formule** : COUNT(événements `sign_up` où `method = "credentials"` OU `method = "google"`)
- **Cible Initiale (3 premiers mois)** : 20 inscriptions/mois
- **Cible Optimiste (mois 6-12)** : 50+ inscriptions/mois
- **Segmentation prioritaire** : Par méthode d'inscription (email/password vs Google OAuth)

### KPI Secondaire Critique

**Taux de conversion global SEO** (Visiteurs organiques → Inscriptions)

- **Formule** : (Inscriptions organiques / Sessions organiques) × 100
- **Cible** : 2-5% (benchmark SaaS B2B freemium)
- **Mesure** : Via segment GA4 "Trafic organique" (source = "google", medium = "organic")

---

## 2. KPIs Secondaires et Métriques de Support

Ces métriques permettent de diagnostiquer **pourquoi** le KPI primaire monte ou descend, et d'identifier les leviers d'optimisation.

### 2.1 Acquisition SEO - Performance du Tunnel

#### A. Trafic organique qualifié
- **Métrique** : Sessions organiques mensuelles (source=google, medium=organic)
- **Cible** : 1000+ sessions/mois (pour atteindre 20 inscriptions à 2% de conversion)
- **Segmentation** : Par landing page (homepage vs blog vs guides SEO)

#### B. Taux de rebond par type de page
- **Métrique** : Bounce rate sur pages de destination SEO
- **Cible** : <60% sur pages marketing, <70% sur blog
- **Alerte** : Si >80%, signale un problème de pertinence contenu/requête

#### C. Temps d'engagement moyen
- **Métrique** : Average engagement time par session
- **Cible** : >45 secondes sur pages marketing, >2 min sur articles blog
- **Utilité** : Indicateur de qualité du contenu et de l'intérêt réel

#### D. Pages vues par session (visiteurs organiques)
- **Métrique** : Pages/Session pour trafic organique
- **Cible** : >1,5 (indique navigation vers d'autres pages)
- **Signal positif** : Si visiteur blog → fonctionnalités → inscription

### 2.2 Conversion - Étapes du Tunnel

#### E. Vues de la page d'inscription
- **Métrique** : Pageviews `/auth/register`
- **Ratio clé** : Sessions organiques → Vues page inscription
- **Cible** : >15% des visiteurs organiques atteignent la page

#### F. Taux de complétion formulaire d'inscription
- **Métrique** : (sign_up complétés / vues page inscription) × 100
- **Cible** : >40% (benchmark formulaires SaaS)
- **Diagnostic** : Si <30%, problème UX ou champs trop complexes

#### G. Répartition méthode d'inscription
- **Métrique** : % Google OAuth vs Email/Password
- **Utilité** : Si Google OAuth domine, simplifier cette option en priorité
- **Hypothèse** : OAuth = friction réduite = meilleur taux de conversion

### 2.3 SEO - Performance des Contenus

#### H. Top 10 landing pages organiques
- **Métrique** : Pages générant le plus de sessions organiques
- **Action** : Identifier les contenus performants à dupliquer/améliorer
- **Export GSC** : Corréler avec requêtes de recherche

#### I. Taux de conversion par landing page
- **Métrique** : Conversions (sign_up) / Sessions par page d'entrée
- **Utilité** : Identifier les contenus qui convertissent le mieux
- **Exemple** : Si `/logiciel-devis-institut-beaute` convertit à 8% vs homepage à 1%, optimiser cette page

---

## 3. Conversions et Événements Critiques

### 3.1 Conversions Primaires (à configurer dans GA4)

#### Conversion 1 : `sign_up` (PRIORITÉ CRITIQUE)
- **Déclenchement** : Lors de la création réussie d'un compte User + Business
- **Emplacement code** : `app/actions/auth.ts` (fonction register) + callback OAuth Google
- **Paramètres obligatoires** :
  - `method` : "credentials" | "google"
  - `user_id` : businessId (pour User ID tracking)
- **Marquage GA4** : ✅ Conversion principale

#### Conversion 2 : `form_submit_contact` (PRIORITÉ MOYENNE)
- **Déclenchement** : Soumission du formulaire de contact (`/contact`)
- **Utilité** : Lead alternatif si l'utilisateur ne s'inscrit pas directement
- **Paramètres** :
  - `form_name` : "contact"
  - `form_location` : URL de la page
- **Marquage GA4** : ✅ Conversion secondaire

#### Conversion 3 : `trial_started` (OPTIONNEL - Phase 2)
- **Déclenchement** : Première connexion après inscription (Business en status TRIAL)
- **Utilité** : Séparer "compte créé" de "compte activé"
- **Marquage GA4** : Conversion tertiaire (optionnel)

### 3.2 Événements de Support (Non-Conversions)

#### Événement A : `page_view` (automatique GA4)
- **Paramètres enrichis** :
  - `page_category` : "marketing" | "blog" | "legal" | "dashboard" | "auth"
  - `user_authenticated` : true/false
  - `subscription_status` : "TRIAL" | "ACTIVE" | "CANCELED" | null
  - `content_type` : "article" | "guide" | "landing_page"

#### Événement B : `click_cta_register`
- **Déclenchement** : Clic sur boutons "Essayer gratuitement", "S'inscrire", "Créer un compte"
- **Paramètres** :
  - `cta_location` : "hero" | "navbar" | "footer" | "blog_inline" | "pricing_card"
  - `cta_text` : Texte du bouton cliqué
  - `page_path` : URL de la page

#### Événement C : `form_start_register`
- **Déclenchement** : Premier champ du formulaire d'inscription rempli (focus + input)
- **Utilité** : Mesurer le taux d'abandon entre "vue page inscription" et "début remplissage"

#### Événement D : `oauth_button_click`
- **Déclenchement** : Clic sur "Continuer avec Google"
- **Paramètres** :
  - `provider` : "google"
  - `page_type` : "register" | "login"

#### Événement E : `sign_up_error`
- **Déclenchement** : Échec de l'inscription (email déjà pris, validation échouée, erreur serveur)
- **Paramètres** :
  - `error_type` : "email_exists" | "validation_failed" | "server_error" | "oauth_failed"
  - `method` : "credentials" | "google"
  - `error_message` : Message d'erreur (sanitisé, max 100 char)

#### Événement F : `scroll_depth` (automatique GA4)
- **Paramètres** : 25%, 50%, 75%, 90%
- **Utilité** : Mesurer l'engagement contenu sur pages SEO longues

### 3.3 Tunnel de Conversion Complet

```
Étape 1 : page_view (page_category = "marketing" ou "blog")
         ↓ [Perte estimée : 85%]
Étape 2 : click_cta_register
         ↓ [Perte estimée : 30%]
Étape 3 : page_view (/auth/register)
         ↓ [Perte estimée : 20%]
Étape 4 : form_start_register
         ↓ [Perte estimée : 40%]
Étape 5 : sign_up ✅ CONVERSION
```

**Taux de conversion attendu** : ~2% global (de l'étape 1 à 5)

---

## 4. Segments et Rapports Personnalisés

### 4.1 Segments Utilisateurs Prioritaires

#### Segment 1 : "Visiteurs Organiques SEO"
- **Condition** : Session source = "google" AND medium = "organic"
- **Utilité** : Isoler le trafic SEO pour calculer le taux de conversion acquisition

#### Segment 2 : "Convertis Organiques"
- **Condition** : A réalisé événement `sign_up` AND première source = "google" / "organic"
- **Utilité** : Analyser le comportement des utilisateurs acquis via SEO

#### Segment 3 : "Abandons Formulaire Inscription"
- **Condition** : A déclenché `form_start_register` MAIS PAS `sign_up` dans les 30 minutes
- **Utilité** : Identifier les points de friction sur le formulaire

#### Segment 4 : "Lecteurs Blog Engagés"
- **Condition** : page_category = "blog" AND engagement_time > 120s AND scroll_depth ≥ 75%
- **Utilité** : Identifier les utilisateurs très qualifiés par le contenu

#### Segment 5 : "Mobile vs Desktop (Organiques)"
- **Condition** : Trafic organique segmenté par device_category
- **Utilité** : Identifier si le taux de conversion diffère par device

### 4.2 Rapports Personnalisés (Explorations GA4)

#### Rapport 1 : "Dashboard Acquisition SEO Hebdomadaire"
- **Type** : Free Form (tableau croisé)
- **Dimensions** : Week, Landing page
- **Métriques** : Sessions, sign_up, Taux de conversion, Engagement time, Bounce rate
- **Filtres** : Source = "google", Medium = "organic"

#### Rapport 2 : "Funnel d'Acquisition Complet"
- **Type** : Funnel Exploration
- **Étapes** : 5 étapes du tunnel (détaillées section 3.3)
- **Segmentation** : Par source/medium, device, landing page category

#### Rapport 3 : "Performance des Contenus SEO"
- **Type** : Free Form
- **Dimensions** : Landing page (pages blog et guides SEO)
- **Métriques** : Sessions, New users, Engagement rate, Conversions, Taux de conversion
- **Tri** : Par taux de conversion décroissant

#### Rapport 4 : "Analyse des Échecs d'Inscription"
- **Type** : Event Exploration
- **Événement** : `sign_up_error`
- **Dimensions** : error_type, method, Landing page
- **Utilité** : Diagnostiquer les problèmes techniques bloquant les inscriptions

#### Rapport 5 : "Cohortes d'Inscription par Semaine"
- **Type** : Cohort Exploration
- **Cohorte** : Utilisateurs ayant déclenché `sign_up` (groupés par semaine)
- **Métrique** : Sessions (retour dans les 7, 14, 30 jours)
- **Utilité** : Mesurer si les utilisateurs acquis via SEO reviennent

### 4.3 Alertes Personnalisées Recommandées

#### Alerte 1 : "Chute des Inscriptions"
- **Condition** : Événement `sign_up` < 5 par semaine OU -50% vs semaine précédente
- **Notification** : Email immédiat

#### Alerte 2 : "Taux d'Erreur Inscription Élevé"
- **Condition** : `sign_up_error` > 15% des tentatives sur 24h
- **Notification** : Email quotidien

#### Alerte 3 : "Trafic Organique Anormal"
- **Condition** : Sessions organiques -70% sur 7 jours glissants
- **Notification** : Email

### 4.4 Intégrations Recommandées

#### A. Google Search Console ↔ GA4
- Lier les deux comptes dans GA4 (Admin → Property → Product Links)
- Permet de voir les requêtes de recherche qui génèrent du trafic
- Identifier les mots-clés organiques → landing pages → conversions

#### B. Looker Studio (Data Studio)
- Créer un dashboard externe pour la direction/marketing
- KPIs affichés : Inscriptions mensuelles, Taux conversion SEO, Top landing pages, Funnel visuel
- Automatisation : Envoi email mensuel PDF

#### C. BigQuery Export (Phase 2 - optionnel)
- Exporter les événements bruts GA4 vers BigQuery
- Permet des analyses SQL personnalisées (attribution multi-touch, LTV par source, etc.)

---

## 5. Maintenance et Monitoring

### Checklist Hebdomadaire (5 min)
- [ ] Vérifier rapport "Dashboard Acquisition SEO Hebdomadaire"
- [ ] Comparer semaine actuelle vs semaine précédente
- [ ] Vérifier top 3 landing pages organiques
- [ ] Checker alertes déclenchées

### Checklist Mensuelle (30 min)
- [ ] Analyser "Funnel d'Acquisition Complet" → identifier étape bloquante
- [ ] Analyser "Performance des Contenus SEO"
- [ ] Exporter données Search Console → nouvelles opportunités mots-clés
- [ ] Vérifier "Analyse des Échecs d'Inscription"
- [ ] Comparer taux conversion mobile vs desktop
- [ ] Vérifier "Cohortes d'Inscription"
- [ ] Mettre à jour dashboard Looker Studio

### Checklist Trimestrielle (2h)
- [ ] Audit complet des événements trackés
- [ ] Review des custom dimensions
- [ ] Analyse attribution (mix source/medium)
- [ ] Audit RGPD (consent rate, privacy policy)
- [ ] Mise à jour documentation

---

## 6. Évolution Future

### Phase 2 - Activation & Engagement (3-6 mois)
- Ajouter événements post-inscription : `first_quote_created`, `quote_sent`, `quote_pdf_downloaded`
- **KPI Phase 2** : Taux d'activation (% inscrits ayant créé leur premier devis dans les 7 jours)

### Phase 3 - Monétisation (6-12 mois, quand Stripe activé)
- Tracking e-commerce GA4 complet : `begin_checkout`, `purchase`, `subscription_cancel`
- Paramètres e-commerce : transaction_id, value, currency, items

### Phase 4 - Optimisation Avancée (12+ mois)
- BigQuery Export pour analyses SQL custom
- Predictive Audiences (ML GA4)
- Attribution Multi-Touch
- Server-Side Tracking (contourner adblockers)
- Intégration CRM

---

**Dernière mise à jour** : 2025-12-25
**Prochaine révision** : Trimestre Q1 2026
