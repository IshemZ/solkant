# UX.md – Revue UX et Recommandations Devisio

Ce document regroupe les observations UX, les retours utilisateurs, et les pistes d'amélioration visuelle et fonctionnelle pour Devisio.

---

## Score UX Global (au 2025-12-01)

**Note** : 7.5 / 10  
*Amélioration notable depuis 6.5 lors du premier audit*

| Critère UX            | Note  | Observations                            |
|----------------------|-------|------------------------------------------|
| Design visuel        | 7.5   | Bonne cohérence, esthétique sobre        |
| Navigation           | 7     | Manque un menu mobile                   |
| Feedback utilisateur | 5     | Pas de toasts ou confirmations visuelles |
| Accessibilité (a11y) | 6     | Focus manquant, attributs ARIA absents  |
| Langue & ton         | 10    | Tout le contenu est bien localisé (FR)  |
| Formulaires          | 7     | Validation OK, mot de passe non visible |
| Responsive           | 7     | Bonne base, mais nav mobile absente     |
| Gestion d’erreurs    | 6     | Messages trop génériques                |

---

## ✅ Problèmes critiques déjà corrigés

- Localisation française complète (textes UI, erreurs)
- Route `/dashboard` créée avec layout protégé
- Fonctionnalité SignOut NextAuth OK
- Langue HTML et balises metadata ajoutées

---

## ❌ Problèmes restants (à corriger)

- [ ] Absence de feedback utilisateur (toasts)
- [ ] Erreurs trop génériques (sans contexte)
- [ ] Pas de focus visibles / navigation clavier

---

## 🔁 Améliorations UI prévues (Phase 2)

- [ ] Icone œil pour mot de passe visible
- [ ] Flow "Mot de passe oublié"
- [ ] Navigation mobile responsive
- [ ] Design tokens dans les formulaires
- [ ] Feedback d’erreur inline par champ (Zod)

---

## 🌱 Idées UX futures (Phase 3)

- Preuves sociales (avis client)
- Page de tarifs & CTA vers essais
- Captures d’écran dans la home
- Onboarding guidé
- Transitions & micro-interactions fluides
- Accessibilité complète (lecteur écran + clavier)

---

## Thème & Couleurs UI

- **Primaire** : `#D4B5A0` (beige clair)
- **Secondaire** : `#8B7355` (brun élégant)
- Polices : Geist Sans & Mono
- Dark mode activé via `prefers-color-scheme`

---

## Liens utiles

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`VALIDATION.md`](VALIDATION.md)
- [`ROADMAP.md`](ROADMAP.md)
- [`AUTH.md`](AUTH.md)

---

*Dernière mise à jour : 2025-12-01*

