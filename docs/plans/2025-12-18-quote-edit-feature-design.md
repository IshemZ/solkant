# Design: Modification des Devis en Brouillon

**Date:** 2025-12-18
**Statut:** Validé
**Auteur:** Conception collaborative avec Claude Code

## Vue d'ensemble

### Objectif
Permettre aux utilisateurs de modifier les devis lorsqu'ils sont en statut DRAFT en ajoutant des boutons "Modifier" dans l'interface utilisateur.

### Contexte
L'infrastructure backend est **déjà complète**:
- Server action `updateQuote()` avec validation de statut DRAFT (app/actions/quotes.ts:327-471)
- Route `/dashboard/devis/[id]/modifier` configurée
- Composant `QuoteFormEdit` fonctionnel et sécurisé
- Validation Zod avec `updateQuoteSchema`
- Audit logging pour la traçabilité

**Ce qui manque:** Uniquement les points d'entrée dans l'interface utilisateur.

### Portée
Modifications minimales limitées à l'UI:
1. Ajouter bouton "Modifier" dans la liste des devis (QuotesList.tsx)
2. Restructurer les actions dans la vue détail (QuoteView.tsx)
3. Ajouter fonction de suppression dans QuoteView.tsx

## Architecture

### Approche retenue
**Modification conditionnelle basée sur le statut** - Afficher différentes actions selon que le devis est DRAFT ou SENT.

**Alternatives considérées:**
- ❌ Bouton "Modifier" désactivé pour SENT avec tooltip → Complexité UX inutile
- ❌ Bouton "Dupliquer" pour SENT → Fonctionnalité non demandée (YAGNI)
- ✅ Cacher complètement "Modifier" pour SENT → Simple et clair

### Règles métier
| Statut | Peut modifier? | Peut supprimer? | Actions disponibles |
|--------|---------------|-----------------|---------------------|
| DRAFT  | ✅ Oui        | ✅ Oui          | Modifier, Supprimer, Télécharger PDF |
| SENT   | ❌ Non        | ❌ Non          | Télécharger PDF, Envoyer à nouveau |

### Sécurité
Déjà implémentée dans `updateQuote()`:
```typescript
// Ligne 366-371 de app/actions/quotes.ts
if (existingQuote.status !== "DRAFT") {
  return errorResult(
    "Impossible de modifier un devis déjà envoyé",
    "INVALID_STATUS"
  );
}
```

La route `/dashboard/devis/[id]/modifier/page.tsx` vérifie également le statut et redirige si nécessaire (lignes 38-40).

## Modifications détaillées

### 1. QuotesList.tsx (Liste des devis)

**Fichier:** `app/(dashboard)/dashboard/devis/_components/QuotesList.tsx`

**Changement:** Colonne "Actions" (lignes 129-144)

**Comportement actuel:**
Tous les devis affichent:
- "Voir le détail" (bouton bg-foreground/10)
- "Supprimer" (lien texte rouge)

**Nouveau comportement:**

#### Pour DRAFT:
```tsx
<Link href={`/dashboard/devis/${quote.id}/modifier`}
  className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium
             text-background hover:bg-foreground/90 transition-colors">
  Modifier
</Link>
<Link href={`/dashboard/devis/${quote.id}`}
  className="rounded-md bg-foreground/10 px-3 py-1.5 text-sm font-medium
             text-foreground hover:bg-foreground/20 transition-colors">
  Voir
</Link>
<button onClick={() => openDeleteDialog(quote.id)}
  className="text-red-600 hover:text-red-800">
  Supprimer
</button>
```

#### Pour SENT:
```tsx
<Link href={`/dashboard/devis/${quote.id}`}
  className="rounded-md bg-foreground/10 px-3 py-1.5 text-sm font-medium
             text-foreground hover:bg-foreground/20 transition-colors">
  Voir le détail
</Link>
```

**Justification:**
- "Modifier" est l'action principale pour DRAFT → style principal (bg-foreground)
- "Voir" est secondaire → style secondaire (bg-foreground/10)
- "Supprimer" reste accessible pour les brouillons
- SENT affiche seulement "Voir le détail" (lecture seule)

### 2. QuoteView.tsx (Vue détail du devis)

**Fichier:** `app/(dashboard)/dashboard/devis/_components/QuoteView.tsx`

**Changements:**
1. Ajouter imports
2. Ajouter state et fonction de suppression
3. Restructurer les boutons d'action selon le statut

#### Nouveaux imports:
```typescript
import { Pencil, Trash2, Download, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteQuote } from "@/app/actions/quotes";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
```

#### Nouveau state:
```typescript
const router = useRouter();
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
```

#### Nouvelle fonction handleDelete:
```typescript
async function handleDelete() {
  const result = await deleteQuote(quote.id);
  if (result.success) {
    toast.success("Devis supprimé avec succès");
    router.push("/dashboard/devis");
  } else {
    toast.error(result.error || "Erreur lors de la suppression");
  }
}
```

#### Boutons conditionnels (lignes 114-161):

**Pour DRAFT:**
```tsx
<div className="flex gap-3">
  {/* Action principale: Modifier */}
  <Link href={`/dashboard/devis/${quote.id}/modifier`}
    className="inline-flex items-center gap-2 rounded-md bg-foreground
               px-4 py-2 text-sm font-medium text-background
               transition-colors hover:bg-foreground/90">
    <Pencil className="h-4 w-4" />
    Modifier
  </Link>

  {/* Action destructive: Supprimer */}
  <button onClick={() => setDeleteDialogOpen(true)}
    className="inline-flex items-center gap-2 rounded-md border
               border-red-600 px-4 py-2 text-sm font-medium text-red-600
               transition-colors hover:bg-red-50">
    <Trash2 className="h-4 w-4" />
    Supprimer
  </button>

  {/* Action secondaire: Télécharger PDF */}
  <button onClick={handleDownloadPDF} disabled={isGenerating}
    className="inline-flex items-center gap-2 rounded-md border
               border-foreground/20 bg-background px-4 py-2 text-sm
               font-medium text-foreground transition-colors
               hover:bg-foreground/5">
    <Download className="h-4 w-4" />
    {isGenerating ? "Génération..." : "Télécharger PDF"}
  </button>
</div>
```

**Pour SENT:**
```tsx
<div className="flex gap-3">
  {/* Action principale: Télécharger PDF */}
  <button onClick={handleDownloadPDF} disabled={isGenerating}
    className="inline-flex items-center gap-2 rounded-md bg-foreground
               px-4 py-2 text-sm font-medium text-background
               transition-colors hover:bg-foreground/90">
    <Download className="h-4 w-4" />
    {isGenerating ? "Génération..." : "Télécharger PDF"}
  </button>

  {/* Action secondaire: Envoyer à nouveau */}
  <button onClick={handleSendEmail}
    disabled={isSending || !quote.client || !quote.client.email}
    className="inline-flex items-center gap-2 rounded-md border
               border-foreground/20 bg-background px-4 py-2 text-sm
               font-medium text-foreground transition-colors
               hover:bg-foreground/5 disabled:opacity-50
               disabled:cursor-not-allowed">
    <Mail className="h-4 w-4" />
    {isSending ? "Envoi..." : "Envoyer à nouveau"}
  </button>
</div>
```

#### ConfirmDialog à la fin du composant:
```tsx
<ConfirmDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  onConfirm={handleDelete}
  title="Supprimer le devis"
  description="Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible."
  confirmText="Supprimer"
  cancelText="Annuler"
  variant="danger"
/>
```

**Ordre des boutons:**
- **DRAFT:** Modifier (principal) → Supprimer (destructif) → PDF (utilitaire)
- **SENT:** PDF (principal) → Email (utilitaire)

**Justification:**
- L'action la plus courante pour un DRAFT est de le modifier
- La suppression est accessible mais visuellement distincte (border rouge)
- Pour les SENT, télécharger le PDF est l'action principale
- "Envoyer à nouveau" remplace "Envoyer par email" pour clarifier qu'il a déjà été envoyé

## Flux utilisateur

### Scénario 1: Modifier un devis depuis la liste
1. Utilisateur voit la liste des devis
2. Pour un devis DRAFT, clique sur "Modifier"
3. Redirigé vers `/dashboard/devis/[id]/modifier`
4. Modifie le devis avec QuoteFormEdit
5. Clique sur "Enregistrer les modifications"
6. Redirigé vers `/dashboard/devis/[id]` avec toast de succès

### Scénario 2: Modifier un devis depuis la vue détail
1. Utilisateur consulte un devis DRAFT
2. Clique sur le bouton "Modifier" (bouton principal)
3. Redirigé vers `/dashboard/devis/[id]/modifier`
4. Suite identique au scénario 1

### Scénario 3: Supprimer un devis depuis la vue détail
1. Utilisateur consulte un devis DRAFT
2. Clique sur "Supprimer" (bouton border rouge)
3. ConfirmDialog s'affiche
4. Confirme la suppression
5. Devis supprimé, redirigé vers `/dashboard/devis` avec toast

### Scénario 4: Tentative de modifier un devis SENT
1. Utilisateur consulte un devis SENT
2. Aucun bouton "Modifier" n'est visible
3. Protection côté backend si URL directe: redirection depuis `/dashboard/devis/[id]/modifier/page.tsx` (ligne 38-40)

## Gestion des erreurs

### Protection existante
1. **Route modifier/page.tsx** (lignes 38-40):
   ```typescript
   if (quote.status !== "DRAFT") {
     redirect(`/dashboard/devis/${id}`);
   }
   ```

2. **Server action updateQuote** (lignes 366-371):
   ```typescript
   if (existingQuote.status !== "DRAFT") {
     return errorResult(
       "Impossible de modifier un devis déjà envoyé",
       "INVALID_STATUS"
     );
   }
   ```

3. **Multi-tenancy:** Filtre `businessId` présent partout

### Nouveaux messages d'erreur
- Suppression réussie: "Devis supprimé avec succès" (toast success)
- Erreur suppression: Message d'erreur du backend (toast error)

## Tests

### Tests manuels requis
1. **QuotesList - DRAFT:**
   - ✅ Bouton "Modifier" visible et fonctionnel
   - ✅ Bouton "Voir" visible et fonctionnel
   - ✅ Bouton "Supprimer" visible et fonctionnel
   - ✅ Clic sur "Modifier" redirige vers `/dashboard/devis/[id]/modifier`

2. **QuotesList - SENT:**
   - ✅ Bouton "Modifier" caché
   - ✅ Bouton "Supprimer" caché
   - ✅ Seulement "Voir le détail" visible

3. **QuoteView - DRAFT:**
   - ✅ Boutons affichés: "Modifier", "Supprimer", "Télécharger PDF"
   - ✅ Clic sur "Modifier" redirige vers `/dashboard/devis/[id]/modifier`
   - ✅ Clic sur "Supprimer" affiche ConfirmDialog
   - ✅ Confirmation suppression redirige vers `/dashboard/devis`
   - ✅ Annulation ferme le dialog sans action

4. **QuoteView - SENT:**
   - ✅ Boutons affichés: "Télécharger PDF", "Envoyer à nouveau"
   - ✅ "Modifier" et "Supprimer" cachés
   - ✅ "Envoyer à nouveau" désactivé si pas d'email client

5. **Protection backend:**
   - ✅ URL directe `/dashboard/devis/[id]/modifier` pour SENT redirige vers détail
   - ✅ Server action updateQuote refuse les devis SENT

6. **Multi-tenancy:**
   - ✅ Impossible de modifier un devis d'un autre business (déjà testé dans l'existant)

### Tests unitaires
Non nécessaires - modifications purement UI utilisant de la logique déjà testée.

## Checklist d'implémentation

- [ ] Modifier QuotesList.tsx - Ajouter logique conditionnelle pour les boutons
- [ ] Modifier QuoteView.tsx - Ajouter imports (Lucide icons, ConfirmDialog, deleteQuote)
- [ ] Modifier QuoteView.tsx - Ajouter state pour ConfirmDialog
- [ ] Modifier QuoteView.tsx - Ajouter fonction handleDelete
- [ ] Modifier QuoteView.tsx - Restructurer les boutons conditionnellement
- [ ] Modifier QuoteView.tsx - Ajouter ConfirmDialog en bas du composant
- [ ] Tests manuels - Vérifier tous les scénarios DRAFT
- [ ] Tests manuels - Vérifier tous les scénarios SENT
- [ ] Tests manuels - Vérifier protection backend

## Impact et risques

### Impact
- **Utilisateurs:** Amélioration UX majeure - peuvent enfin modifier leurs brouillons facilement
- **Code:** Impact minimal - 2 fichiers modifiés, ~50 lignes ajoutées
- **Performance:** Aucun impact (pas de nouvelles requêtes)

### Risques
- **Très faible:** Réutilisation de code existant et testé
- **Multi-tenancy:** Déjà sécurisé par les server actions existantes
- **État:** Pas de nouveau state complexe, juste UI conditionnelle

### Mesures de mitigation
- Protection backend déjà en place (updateQuote vérifie le statut)
- Route modifier/page.tsx vérifie le statut avant affichage
- Tests manuels couvrent tous les scénarios critiques

## Notes d'implémentation

### Cohérence avec l'existant
- Réutilisation des classes Tailwind existantes dans l'app
- Pattern ConfirmDialog identique à QuotesList
- Structure des boutons cohérente avec le reste de l'UI
- Toast notifications avec Sonner (déjà utilisé)

### Ordre de développement recommandé
1. QuotesList (plus simple, moins de changements)
2. QuoteView (plus de logique, tester la suppression)
3. Tests manuels complets

### Points d'attention
- Bien importer `useRouter` de `next/navigation` (pas `next/router`)
- Utiliser les icônes Lucide déjà dans le projet
- Respecter les classes Tailwind existantes pour cohérence visuelle
- Le texte "Envoyer à nouveau" vs "Envoyer par email" clarifie le contexte

## Conclusion

Design simple et minimal qui:
- ✅ Exploite 100% de l'infrastructure existante
- ✅ Ajoute seulement ce qui est nécessaire (YAGNI)
- ✅ Maintient la cohérence de sécurité multi-tenant
- ✅ Améliore l'UX sans complexité architecturale
- ✅ Respecte les conventions du projet (colocation, French locale, etc.)

**Prochaine étape:** Implémentation avec tests manuels.
