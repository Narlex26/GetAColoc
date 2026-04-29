# Spec — Refactoring & Binding Frontend GetAColoc

**Date :** 2026-04-29  
**Approche retenue :** B — par couche (fondations → locataire → propriétaire → commun)

---

## Contexte

Application React/TypeScript/Vite de mise en relation pour la colocation. Le frontend est actuellement composé de 2 pages (landing statique Figma + login minimal). L'API Flask est opérationnelle sur `http://localhost:5000`. L'objectif est de rendre le projet fonctionnel de bout en bout : corriger les bugs, créer les pages manquantes, extraire les composants réutilisables, et connecter tous les boutons/formulaires aux endpoints réels.

---

## Section 1 — Fondations

### Corrections prioritaires

- **Bug auth** : `authApi.login` et `authApi.register` envoient `email` → renommer en `mail` (champ attendu par l'API)
- **Types TypeScript** : aligner `src/types/index.ts` sur les vrais champs API :
  - `Utilisateur` : `id_user`, `mail`, `telephone`, `nom`, `prenom`, `type`, `date_creation`
  - `Locataire` : étend `Utilisateur` + `id_locataire`, `age`, `sexe` (`'M'|'F'|'A'`), `description`
  - `Proprietaire` : étend `Utilisateur` + `id_proprio`
  - `Logement` : `id_logement`, `code_postal`, `quartier`, `prix`, `superficie`, `etage`, `ville`, `meuble`, `date_creation`
  - `Groupe` : `id_group`, `description`, `date_creation`, `nombre_membres`
- **Store auth** : typer `user` avec `Utilisateur` au lieu de `unknown`

### Routing

- `RootRoute` : si non authentifié → `<Home />` ; si authentifié + type `locataire` → redirect `/recherche` ; si type `proprietaire` → redirect `/mes-logements`
- `ProtectedRoute` : composant wrapper, vérifie la présence du token dans le store, redirige vers `/connexion` si absent
- Table des routes :

| Path | Composant | Protection |
|------|-----------|-----------|
| `/` | `RootRoute` | — |
| `/connexion` | `Login` | public uniquement |
| `/inscription` | `Register` | public uniquement |
| `/recherche` | `Recherche` | locataire |
| `/profils` | `Profils` | locataire |
| `/groupes` | `Groupes` | locataire |
| `/messages` | `Messages` | authentifié |
| `/profil` | `Profil` | authentifié |
| `/mes-logements` | `MesLogements` | propriétaire |
| `/logements/nouveau` | `LogementForm` | propriétaire |
| `/logements/:id/modifier` | `LogementForm` | propriétaire |
| `/logements/:id/candidatures` | `Candidatures` | propriétaire |

### Layouts

- **`PublicLayout`** : header avec logo + liens "Connexion" / "S'inscrire" → utilisé par Login, Register
- **`AppLayout`** : contenu + `BottomNav` fixe en bas → utilisé par toutes les pages authentifiées
- **`BottomNav`** : navigation mobile avec icônes. Onglets selon le `type` :
  - Locataire : Recherche (`/recherche`), Profils (`/profils`), Groupe (`/groupes`), Messages (`/messages`), Profil (`/profil`)
  - Propriétaire : Logements (`/mes-logements`), Messages (`/messages`), Profil (`/profil`)

### API & Hooks

- Corriger `src/api/auth.ts` : champ `mail`, champ response `access_token`
- Compléter `src/api/users.ts` : `GET /users/locataires`, `GET /users/proprietaires`, `PUT /users/:id`
- Compléter `src/api/groupes.ts` : toutes les opérations CRUD + membres + `GET /groupes/mes-groupes`
- Hooks React Query : `useLocataires(filters?)`, `useMyGroupe()`, `useCandidatures(logementId)`, `useMyLogements()`

---

## Section 2 — Pages Locataire

### Inscription (`/inscription`)

- Étape 1 : choix du rôle — deux cards cliquables "Je cherche une coloc" (locataire) / "Je propose un logement" (propriétaire)
- Étape 2 : formulaire selon le rôle
  - Commun : nom, prénom, mail, password, téléphone
  - Locataire uniquement : âge, sexe (M/F/A via select), description (textarea)
- Appel `POST /auth/register` avec champ `type`
- L'endpoint register retourne `{ message, user }` sans token → enchaîner immédiatement `POST /auth/login` avec les mêmes credentials pour obtenir le token
- Après succès : `setAuth(access_token, user)` + redirect selon le type

### Recherche logements (`/recherche`)

- Barre de filtres : ville (text), prix max (number), meublé (toggle)
- Liste de cartes `LogementCard` : ville, quartier, prix €/mois, superficie m², meublé badge, date
- Bouton "Postuler" sur chaque carte :
  - Ouvre un modal
  - Dans le modal : select du groupe de l'utilisateur (chargé depuis `GET /groupes/mes-groupes`), textarea message optionnel
  - Appel `POST /logements/:id/candidatures` avec `{ groupe_id, message }`
  - Désactivé si l'utilisateur n'a pas de groupe (message d'indication)
- Endpoint : `GET /logements?ville=&prix_max=&meuble=`

### Profils locataires (`/profils`)

- Liste des locataires (autres que l'utilisateur connecté)
- Carte profil : prénom, âge, sexe, description
- Filtres : âge min/max, sexe
- Endpoint : `GET /users/locataires?age_min=&age_max=&sexe=`
- Note : le système de like (`liker` table) existe en base mais l'API ne l'expose pas encore → bouton "Inviter dans mon groupe" à la place, qui appelle `POST /groupes/:id/membres` avec l'`id_locataire`

### Mon groupe (`/groupes`)

- **Sans groupe** : bouton "Créer un groupe" (textarea description optionnelle) → `POST /groupes`, puis refresh
- **Avec groupe** :
  - Affiche description, liste des membres (nom, prénom, rôle admin)
  - Bouton "Quitter le groupe" → `DELETE /groupes/:id/membres/:locataire_id` (soi-même)
  - Admin uniquement : bouton "Retirer un membre", champ pour ajouter un locataire par ID
  - Section "Candidatures envoyées" : liste des logements postulés avec statut (en attente / validé)
- Endpoint principal : `GET /groupes/mes-groupes`

---

## Section 3 — Pages Propriétaire

### Mes logements (`/mes-logements`)

- Liste des logements du propriétaire (filtrés par le token côté API — à implémenter si manquant)
- Carte `LogementCard` avec : ville, quartier, prix, superficie, badge meublé, badge "X candidature(s)"
- Actions : "Modifier" → `/logements/:id/modifier`, "Candidatures" → `/logements/:id/candidatures`, "Supprimer" → `DELETE /logements/:id` avec confirmation
- Bouton flottant "+ Nouveau logement" → `/logements/nouveau`

### Formulaire logement (`/logements/nouveau` et `/logements/:id/modifier`)

- Champs : code postal (requis), ville (requis), quartier, prix €/mois (requis), superficie, étage, meublé (toggle)
- Création : `POST /logements` — Édition : `PUT /logements/:id`
- Après succès → retour `/mes-logements`

### Candidatures (`/logements/:id/candidatures`)

- Titre : "Candidatures — [ville du logement]"
- Liste des groupes candidats :
  - Description du groupe, nombre de membres, message de candidature, date
  - Statut badge : "En attente" / "Validé"
  - Bouton "Valider" (si pas encore validé) → `PUT /logements/:id/candidatures/:groupe_id/valider`
- Endpoint : `GET /logements/:id/candidatures`

---

## Section 4 — Pages communes

### Profil (`/profil`)

- Affiche et édite les infos de l'utilisateur connecté
- Champs communs : nom, prénom, téléphone
- Locataire uniquement : âge, sexe, description
- Sauvegarde : `PUT /users/:id` avec l'ID de l'utilisateur courant depuis le store
- Bouton "Se déconnecter" : appelle `logout()` du store + navigate(`/`)

### Messages (`/messages`)

- Page placeholder : "Messagerie — fonctionnalité à venir"
- L'API ne gère pas encore les messages → aucun binding

---

## Composants réutilisables à extraire

| Composant | Utilisation |
|-----------|------------|
| `LogementCard` | Recherche + Mes logements |
| `LocataireCard` | Profils |
| `GroupeCard` | Mon groupe + Candidatures |
| `Modal` | Postuler à un logement, confirmations |
| `FilterBar` | Recherche, Profils |
| `EmptyState` | Listes vides (aucun logement, aucune candidature…) |
| `LoadingSpinner` | États de chargement React Query |
| `FormField` | Wrapper label + input + message d'erreur |

---

## Contraintes techniques

- Pas de test suite configurée — pas d'obligation d'écrire des tests
- L'API n'expose pas de `GET /logements/mes-logements` : le propriétaire est lié via la table `proposer`. En attendant un endpoint dédié côté backend, la page "Mes logements" affichera tous les logements (`GET /logements`) avec un filtre visuel côté client sur le `proprietaire_id`. **À signaler au backend pour ajouter un endpoint filtré par token.**
- Le système de like (table `liker`) n'est pas encore exposé par l'API → remplacé provisoirement par "Inviter dans mon groupe"
- Mobile-first : `AppLayout` avec bottom nav, pages scrollables verticalement
