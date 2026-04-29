# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
npm run dev       # Serveur de développement (Vite, port 5173)
npm run build     # Compilation TypeScript + build Vite
npm run lint      # ESLint sur tout le projet
npm run preview   # Aperçu du build de production
```

Il n'y a pas de suite de tests configurée.

## Variable d'environnement

Copier `.env.example` en `.env` et ajuster si besoin :

```
VITE_API_URL=http://localhost:5000
```

## Architecture

### Couche API (`src/api/`)

- `client.ts` — instance Axios centralisée. Attache automatiquement le Bearer token depuis le store Zustand sur chaque requête et appelle `logout()` sur toute réponse 401.
- Les autres modules (`auth.ts`, `logements.ts`, `groupes.ts`, `users.ts`) exposent des objets d'API qui wrappent `client` et retournent directement `r.data`.

### État global (`src/store/`)

- `auth.ts` — store Zustand persisté (`localStorage`, clé `gac-auth`). Expose `token`, `user`, `setAuth()`, `logout()`. C'est la seule source de vérité pour l'authentification.

### Hooks (`src/hooks/`)

Hooks React Query qui wrappent les appels API. Toute nouvelle intégration de données distantes doit passer par un hook dédié ici (pas d'appels API directs dans les composants).

### Routing (`src/router.tsx`)

React Router DOM v7 avec `createBrowserRouter`. La route `/` est gérée par `RootRoute` qui redirige vers `<Home>` (public) ou `<HomeConnected>` (authentifié) selon la présence du token.

Routes actuelles : `/connexion`, `/inscription`, `/profil`, `/messages`, `/profils`, `/recherche`.

### Types (`src/types/index.ts`)

Interfaces TypeScript alignées sur les modèles Flask backend : `Utilisateur`, `Logement`, `Photo`, `Groupe`. À mettre à jour quand les schémas backend évoluent.

### Design system (Tailwind)

Tokens personnalisés dans `tailwind.config.js` :
- Couleurs : `dark-blue` (#273F6D), `orange-400` (#FFBD59), palettes `blue-100` à `blue-600`
- Polices : `font-syne` (Syne), `font-inter` (Inter) — importées via CSS global

## Déploiement

Build Docker multi-étapes : Node 20 pour compiler, puis image nginx pour servir `dist/`. Le fichier `nginx.conf` est copié dans l'image.
