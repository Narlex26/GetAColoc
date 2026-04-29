# Frontend Refactor & API Binding — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer le frontend GetAColoc d'un état statique Figma en application fonctionnelle connectée à l'API Flask, avec routing protégé, auth réelle, et toutes les pages locataire et propriétaire.

**Architecture:** Approche par couche — (1) corriger types + API layer + store, (2) composants communs + layouts, (3) routing, (4) pages auth, (5) hooks React Query, (6) pages locataire, (7) pages propriétaire, (8) pages communes. Pas de suite de tests configurée : vérification par compilation TypeScript (`npm run build`) et inspection visuelle dans le navigateur.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 3, React Router DOM v7, Zustand + persist, TanStack Query v5, Axios

---

## Cartographie des fichiers

### Modifiés
- `src/types/index.ts` — aligner avec les vrais champs API
- `src/api/auth.ts` — renommer `email`→`mail`, corriger types retour
- `src/api/users.ts` — compléter (locataires, proprietaires, update)
- `src/api/groupes.ts` — compléter (mes-groupes, membres)
- `src/api/logements.ts` — ajouter candidatures
- `src/store/auth.ts` — typer `user` avec `Utilisateur`
- `src/components/common/Button.tsx` — ajouter prop `type`
- `src/hooks/useLogements.ts` — ajouter filtres
- `src/router.tsx` — toutes les routes
- `src/pages/Login.tsx` — fix champ + style

### Créés
- `src/components/common/Modal.tsx`
- `src/components/common/EmptyState.tsx`
- `src/components/common/LoadingSpinner.tsx`
- `src/components/common/FormField.tsx`
- `src/components/layout/PublicLayout.tsx`
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/common/ProtectedRoute.tsx`
- `src/components/logement/LogementCard.tsx`
- `src/components/locataire/LocataireCard.tsx`
- `src/pages/RootRoute.tsx`
- `src/pages/Register.tsx`
- `src/pages/Recherche.tsx`
- `src/pages/Profils.tsx`
- `src/pages/Groupes.tsx`
- `src/pages/Profil.tsx`
- `src/pages/Messages.tsx`
- `src/pages/MesLogements.tsx`
- `src/pages/LogementForm.tsx`
- `src/pages/Candidatures.tsx`
- `src/hooks/useLocataires.ts`
- `src/hooks/useGroupes.ts`
- `src/hooks/useCandidatures.ts`

---

## Task 1 — Fondations : types, API layer, store

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/api/auth.ts`
- Modify: `src/api/users.ts`
- Modify: `src/api/groupes.ts`
- Modify: `src/api/logements.ts`
- Modify: `src/store/auth.ts`
- Modify: `src/components/common/Button.tsx`

- [ ] **Étape 1 : Réécrire `src/types/index.ts`**

```typescript
export interface Utilisateur {
  id_user: number;
  mail: string;
  telephone?: string;
  nom: string;
  prenom: string;
  type: 'locataire' | 'proprietaire';
  date_creation?: string;
}

export interface Locataire extends Utilisateur {
  id_locataire: number;
  age?: number;
  sexe?: 'M' | 'F' | 'A';
  description?: string;
}

export interface Proprietaire extends Utilisateur {
  id_proprio: number;
}

export interface Logement {
  id_logement: number;
  code_postal: string;
  quartier?: string;
  prix: number;
  superficie?: string;
  etage?: number;
  ville: string;
  meuble: boolean;
  date_creation?: string;
}

export interface Groupe {
  id_group: number;
  description?: string;
  date_creation?: string;
  nombre_membres: number;
}

export interface Candidature {
  id_group: number;
  description?: string;
  nombre_membres: number;
  message?: string;
  is_valid: boolean;
}
```

- [ ] **Étape 2 : Réécrire `src/api/auth.ts`**

```typescript
import { api } from './client';
import type { Utilisateur } from '../types';

export interface LoginPayload {
  mail: string;
  password: string;
}

export interface RegisterPayload {
  mail: string;
  password: string;
  nom: string;
  prenom: string;
  type: 'locataire' | 'proprietaire';
  telephone?: string;
  age?: number;
  sexe?: 'M' | 'F' | 'A';
  description?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: Utilisateur;
  message?: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', data).then(r => r.data),
  register: (data: RegisterPayload) =>
    api.post<{ message: string; user: Utilisateur }>('/auth/register', data).then(r => r.data),
  me: () => api.get<Utilisateur>('/auth/me').then(r => r.data),
};
```

- [ ] **Étape 3 : Réécrire `src/api/users.ts`**

```typescript
import { api } from './client';
import type { Utilisateur, Locataire, Proprietaire } from '../types';

export interface UpdateUserPayload {
  nom?: string;
  prenom?: string;
  telephone?: string;
  age?: number;
  sexe?: 'M' | 'F' | 'A';
  description?: string;
}

export const usersApi = {
  getById: (id: number) =>
    api.get<Utilisateur>(`/users/${id}`).then(r => r.data),
  update: (id: number, data: UpdateUserPayload) =>
    api.put<{ message: string; user: Utilisateur }>(`/users/${id}`, data).then(r => r.data),
  getLocataires: (params?: { age_min?: number; age_max?: number; sexe?: string }) =>
    api.get<Locataire[]>('/users/locataires', { params }).then(r => r.data),
  getProprietaires: () =>
    api.get<Proprietaire[]>('/users/proprietaires').then(r => r.data),
};
```

- [ ] **Étape 4 : Réécrire `src/api/groupes.ts`**

```typescript
import { api } from './client';
import type { Groupe } from '../types';

export const groupesApi = {
  getAll: () =>
    api.get<Groupe[]>('/groupes').then(r => r.data),
  getById: (id: number) =>
    api.get<Groupe>(`/groupes/${id}`).then(r => r.data),
  getMes: () =>
    api.get<Groupe[]>('/groupes/mes-groupes').then(r => r.data),
  create: (data: { description?: string }) =>
    api.post<{ message: string; groupe: Groupe }>('/groupes', data).then(r => r.data),
  update: (id: number, data: { description?: string }) =>
    api.put<{ message: string; groupe: Groupe }>(`/groupes/${id}`, data).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/groupes/${id}`).then(r => r.data),
  addMembre: (groupeId: number, locataireId: number, isAdmin = false) =>
    api.post(`/groupes/${groupeId}/membres`, { locataire_id: locataireId, is_admin: isAdmin }).then(r => r.data),
  removeMembre: (groupeId: number, locataireId: number) =>
    api.delete(`/groupes/${groupeId}/membres/${locataireId}`).then(r => r.data),
};
```

- [ ] **Étape 5 : Ajouter les candidatures dans `src/api/logements.ts`**

Remplacer le contenu entier par :

```typescript
import { api } from './client';
import type { Logement, Groupe } from '../types';

export interface LogementPayload {
  code_postal: string;
  ville: string;
  quartier?: string;
  prix: number;
  superficie?: string;
  etage?: number;
  meuble?: boolean;
}

export const logementsApi = {
  list: (params?: { ville?: string; code_postal?: string; prix_min?: number; prix_max?: number; meuble?: boolean }) =>
    api.get<Logement[]>('/logements', { params }).then(r => r.data),
  get: (id: number) =>
    api.get<Logement>(`/logements/${id}`).then(r => r.data),
  create: (data: LogementPayload) =>
    api.post<{ message: string; logement: Logement }>('/logements', data).then(r => r.data),
  update: (id: number, data: Partial<LogementPayload>) =>
    api.put<{ message: string; logement: Logement }>(`/logements/${id}`, data).then(r => r.data),
  remove: (id: number) =>
    api.delete(`/logements/${id}`).then(r => r.data),
  getCandidatures: (logementId: number) =>
    api.get<Groupe[]>(`/logements/${logementId}/candidatures`).then(r => r.data),
  addCandidature: (logementId: number, data: { groupe_id: number; message?: string }) =>
    api.post(`/logements/${logementId}/candidatures`, data).then(r => r.data),
  validateCandidature: (logementId: number, groupeId: number) =>
    api.put(`/logements/${logementId}/candidatures/${groupeId}/valider`).then(r => r.data),
};
```

- [ ] **Étape 6 : Mettre à jour `src/store/auth.ts`**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Utilisateur } from '../types';

interface AuthState {
  token: string | null;
  user: Utilisateur | null;
  setAuth: (token: string, user: Utilisateur) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'gac-auth' }
  )
);
```

- [ ] **Étape 7 : Ajouter la prop `type` dans `src/components/common/Button.tsx`**

Remplacer l'interface et la signature :

```typescript
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled' | 'onClick'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'font-syne font-bold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-orange-400 hover:bg-orange-500 text-dark-blue',
    secondary: 'bg-transparent text-white border border-orange-400 hover:bg-orange-400 hover:text-dark-blue',
    outline: 'border border-dark-blue text-dark-blue bg-dark-blue hover:opacity-90',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Étape 8 : Vérifier la compilation**

```bash
npm run build
```

Attendu : compilation sans erreur TypeScript. Si des erreurs subsistent, les corriger avant de continuer.

- [ ] **Étape 9 : Commit**

```bash
git add src/types/index.ts src/api/auth.ts src/api/users.ts src/api/groupes.ts src/api/logements.ts src/store/auth.ts src/components/common/Button.tsx
git commit -m "fix: align types and API layer with Flask backend field names"
```

---

## Task 2 — Composants communs + Layouts

**Files:**
- Create: `src/components/common/Modal.tsx`
- Create: `src/components/common/EmptyState.tsx`
- Create: `src/components/common/LoadingSpinner.tsx`
- Create: `src/components/common/FormField.tsx`
- Create: `src/components/layout/PublicLayout.tsx`
- Create: `src/components/layout/AppLayout.tsx`
- Create: `src/components/layout/BottomNav.tsx`

- [ ] **Étape 1 : Créer `src/components/common/Modal.tsx`**

```typescript
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-dark-blue text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none hover:text-gray-600">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Étape 2 : Créer `src/components/common/EmptyState.tsx`**

```typescript
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <p className="font-syne font-bold text-dark-blue text-lg mb-2">{title}</p>
      {description && <p className="text-gray-500 text-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
```

- [ ] **Étape 3 : Créer `src/components/common/LoadingSpinner.tsx`**

```typescript
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

- [ ] **Étape 4 : Créer `src/components/common/FormField.tsx`**

```typescript
import { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({ label, error, className = '', ...props }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-syne font-medium text-dark-blue">{label}</label>
      <input
        className={`w-full border rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-orange-400 ${error ? 'border-red-400' : 'border-gray-200'} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
```

- [ ] **Étape 5 : Créer `src/components/layout/PublicLayout.tsx`**

```typescript
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link to="/" className="font-syne font-black text-dark-blue text-lg">Get A Coloc</Link>
        <div className="flex gap-4 items-center">
          <Link to="/connexion" className="text-sm font-syne text-dark-blue hover:opacity-70">
            Connexion
          </Link>
          <Link
            to="/inscription"
            className="text-sm font-syne bg-orange-400 text-dark-blue px-4 py-2 rounded-full font-bold hover:bg-orange-500 transition-colors"
          >
            S'inscrire
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
```

- [ ] **Étape 6 : Créer `src/components/layout/BottomNav.tsx`**

```typescript
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const locataireLinks = [
  { to: '/recherche', label: 'Recherche', icon: '🔍' },
  { to: '/profils', label: 'Profils', icon: '👥' },
  { to: '/groupes', label: 'Groupe', icon: '🏠' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/profil', label: 'Profil', icon: '👤' },
];

const proprietaireLinks = [
  { to: '/mes-logements', label: 'Logements', icon: '🏘️' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/profil', label: 'Profil', icon: '👤' },
];

export default function BottomNav() {
  const user = useAuthStore(s => s.user);
  const links = user?.type === 'proprietaire' ? proprietaireLinks : locataireLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 safe-area-pb">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs px-2 py-1 ${
              isActive ? 'text-dark-blue font-bold' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
```

- [ ] **Étape 7 : Créer `src/components/layout/AppLayout.tsx`**

```typescript
import { ReactNode } from 'react';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
```

- [ ] **Étape 8 : Vérifier la compilation**

```bash
npm run build
```

- [ ] **Étape 9 : Commit**

```bash
git add src/components/
git commit -m "feat: add layout components and common UI primitives"
```

---

## Task 3 — Routing complet

**Files:**
- Create: `src/components/common/ProtectedRoute.tsx`
- Create: `src/pages/RootRoute.tsx`
- Modify: `src/router.tsx`

- [ ] **Étape 1 : Créer `src/components/common/ProtectedRoute.tsx`**

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import AppLayout from '../layout/AppLayout';

export default function ProtectedRoute() {
  const token = useAuthStore(s => s.token);
  if (!token) return <Navigate to="/connexion" replace />;
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Étape 2 : Créer `src/pages/RootRoute.tsx`**

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Home from './Home';

export default function RootRoute() {
  const { token, user } = useAuthStore();
  if (!token) return <Home />;
  if (user?.type === 'proprietaire') return <Navigate to="/mes-logements" replace />;
  return <Navigate to="/recherche" replace />;
}
```

- [ ] **Étape 3 : Créer les pages placeholder (pour que le router compile)**

Créer `src/pages/Register.tsx` (placeholder) :
```typescript
export default function Register() {
  return <div>Register — à implémenter</div>;
}
```

Créer `src/pages/Recherche.tsx` (placeholder) :
```typescript
export default function Recherche() {
  return <div className="p-6">Recherche — à implémenter</div>;
}
```

Créer `src/pages/Profils.tsx` (placeholder) :
```typescript
export default function Profils() {
  return <div className="p-6">Profils — à implémenter</div>;
}
```

Créer `src/pages/Groupes.tsx` (placeholder) :
```typescript
export default function Groupes() {
  return <div className="p-6">Groupes — à implémenter</div>;
}
```

Créer `src/pages/Messages.tsx` :
```typescript
export default function Messages() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-4xl mb-4">💬</p>
      <h1 className="font-syne font-black text-dark-blue text-xl mb-2">Messagerie</h1>
      <p className="text-gray-500 text-sm">Fonctionnalité à venir prochainement.</p>
    </div>
  );
}
```

Créer `src/pages/Profil.tsx` (placeholder) :
```typescript
export default function Profil() {
  return <div className="p-6">Profil — à implémenter</div>;
}
```

Créer `src/pages/MesLogements.tsx` (placeholder) :
```typescript
export default function MesLogements() {
  return <div className="p-6">Mes logements — à implémenter</div>;
}
```

Créer `src/pages/LogementForm.tsx` (placeholder) :
```typescript
export default function LogementForm() {
  return <div className="p-6">Formulaire logement — à implémenter</div>;
}
```

Créer `src/pages/Candidatures.tsx` (placeholder) :
```typescript
export default function Candidatures() {
  return <div className="p-6">Candidatures — à implémenter</div>;
}
```

- [ ] **Étape 4 : Réécrire `src/router.tsx`**

```typescript
import { createBrowserRouter } from 'react-router-dom';
import RootRoute from './pages/RootRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Recherche from './pages/Recherche';
import Profils from './pages/Profils';
import Groupes from './pages/Groupes';
import Messages from './pages/Messages';
import Profil from './pages/Profil';
import MesLogements from './pages/MesLogements';
import LogementForm from './pages/LogementForm';
import Candidatures from './pages/Candidatures';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <RootRoute /> },
  { path: '/connexion', element: <Login /> },
  { path: '/inscription', element: <Register /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/recherche', element: <Recherche /> },
      { path: '/profils', element: <Profils /> },
      { path: '/groupes', element: <Groupes /> },
      { path: '/messages', element: <Messages /> },
      { path: '/profil', element: <Profil /> },
      { path: '/mes-logements', element: <MesLogements /> },
      { path: '/logements/nouveau', element: <LogementForm /> },
      { path: '/logements/:id/modifier', element: <LogementForm /> },
      { path: '/logements/:id/candidatures', element: <Candidatures /> },
    ],
  },
]);
```

- [ ] **Étape 5 : Vérifier la compilation**

```bash
npm run build
```

- [ ] **Étape 6 : Vérifier le routing dans le navigateur**

```bash
npm run dev
```

Tester :
- `/` → landing page si pas connecté
- `/connexion` → page login
- `/recherche` → redirige vers `/connexion` (non authentifié)

- [ ] **Étape 7 : Connecter les boutons de la landing page**

Dans `src/components/home/HeroSection.tsx`, remplacer les `<button>` par des `<Link>` :

Ajouter l'import en haut :
```typescript
import { Link } from 'react-router-dom';
```

Remplacer la nav :
```typescript
<div className="flex items-center gap-3 sm:gap-4">
  <Link to="/connexion" className="text-white text-sm sm:text-base font-syne">
    Connexion
  </Link>
  <Link
    to="/inscription"
    className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 font-syne font-bold rounded-full border border-dark-blue text-dark-blue bg-dark-blue hover:opacity-90"
  >
    S'inscrire
  </Link>
</div>
```

Remplacer les CTA :
```typescript
<Link to="/inscription">
  <Button size="lg" className="w-full sm:w-auto">
    Créer mon profil gratuitement
  </Button>
</Link>
<Link to="/connexion">
  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
    Comment ça marche ?
  </Button>
</Link>
```

- [ ] **Étape 8 : Commit**

```bash
git add src/router.tsx src/pages/ src/components/common/ProtectedRoute.tsx src/components/home/HeroSection.tsx
git commit -m "feat: setup protected routing with RootRoute and ProtectedRoute"
```

---

## Task 4 — Page Login (fix + style)

**Files:**
- Modify: `src/pages/Login.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/Login.tsx`**

```typescript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/auth';
import PublicLayout from '../components/layout/PublicLayout';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ mail, password });
      setAuth(res.access_token, res.user);
      navigate(res.user.type === 'proprietaire' ? '/mes-logements' : '/recherche', { replace: true });
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-sm mx-auto px-6 py-12">
        <h1 className="font-syne font-black text-2xl text-dark-blue mb-2">Connexion</h1>
        <p className="text-gray-500 text-sm mb-8">Bon retour parmi nous 👋</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            value={mail}
            onChange={e => setMail(e.target.value)}
            placeholder="ton@email.com"
            required
          />
          <FormField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore inscrit ?{' '}
          <Link to="/inscription" className="text-dark-blue font-bold underline">S'inscrire</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
```

- [ ] **Étape 2 : Tester la connexion**

```bash
npm run dev
```

Aller sur `/connexion`, tenter une connexion avec un compte existant dans l'API. Vérifier la redirection selon le type.

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/Login.tsx
git commit -m "fix: login uses correct 'mail' field and redirects by user type"
```

---

## Task 5 — Page Register

**Files:**
- Modify: `src/pages/Register.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/Register.tsx`**

```typescript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/auth';
import PublicLayout from '../components/layout/PublicLayout';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';

type Role = 'locataire' | 'proprietaire' | null;

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nom: '', prenom: '', mail: '', password: '', telephone: '',
    age: '', sexe: '' as '' | 'M' | 'F' | 'A', description: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError(null);
    setLoading(true);
    try {
      await authApi.register({
        mail: form.mail,
        password: form.password,
        nom: form.nom,
        prenom: form.prenom,
        type: role,
        telephone: form.telephone || undefined,
        ...(role === 'locataire' && {
          age: form.age ? parseInt(form.age) : undefined,
          sexe: (form.sexe as 'M' | 'F' | 'A') || undefined,
          description: form.description || undefined,
        }),
      });
      const loginRes = await authApi.login({ mail: form.mail, password: form.password });
      setAuth(loginRes.access_token, loginRes.user);
      navigate(role === 'proprietaire' ? '/mes-logements' : '/recherche', { replace: true });
    } catch {
      setError("Une erreur est survenue. Cet email est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <PublicLayout>
        <div className="max-w-sm mx-auto px-6 py-12">
          <h1 className="font-syne font-black text-2xl text-dark-blue mb-2">Créer mon compte</h1>
          <p className="text-gray-500 text-sm mb-8">Tu es…</p>
          <div className="space-y-4">
            <button
              onClick={() => setRole('locataire')}
              className="w-full border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-orange-400 hover:bg-orange-400/5 transition-all"
            >
              <p className="text-2xl mb-2">🏡</p>
              <p className="font-syne font-bold text-dark-blue">Je cherche une coloc</p>
              <p className="text-gray-500 text-sm mt-1">Locataire — je veux trouver des colocataires et un logement</p>
            </button>
            <button
              onClick={() => setRole('proprietaire')}
              className="w-full border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-orange-400 hover:bg-orange-400/5 transition-all"
            >
              <p className="text-2xl mb-2">🏘️</p>
              <p className="font-syne font-bold text-dark-blue">Je propose un logement</p>
              <p className="text-gray-500 text-sm mt-1">Propriétaire — je veux mettre en location un bien</p>
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="text-dark-blue font-bold underline">Se connecter</Link>
          </p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-sm mx-auto px-6 py-12">
        <button onClick={() => setRole(null)} className="text-sm text-gray-400 mb-6 flex items-center gap-1">
          ← Retour
        </button>
        <h1 className="font-syne font-black text-2xl text-dark-blue mb-2">
          {role === 'locataire' ? 'Locataire' : 'Propriétaire'}
        </h1>
        <p className="text-gray-500 text-sm mb-8">Remplis tes infos pour commencer</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Prénom" value={form.prenom} onChange={set('prenom')} required />
            <FormField label="Nom" value={form.nom} onChange={set('nom')} required />
          </div>
          <FormField label="Email" type="email" value={form.mail} onChange={set('mail')} placeholder="ton@email.com" required />
          <FormField label="Mot de passe" type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 caractères" required />
          <FormField label="Téléphone" type="tel" value={form.telephone} onChange={set('telephone')} placeholder="06 00 00 00 00" />

          {role === 'locataire' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Âge" type="number" value={form.age} onChange={set('age')} min={18} max={99} />
                <div className="space-y-1">
                  <label className="block text-sm font-syne font-medium text-dark-blue">Sexe</label>
                  <select
                    value={form.sexe}
                    onChange={set('sexe')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">—</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                    <option value="A">Autre</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-syne font-medium text-dark-blue">Description</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Parle un peu de toi..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </Button>
        </form>
      </div>
    </PublicLayout>
  );
}
```

- [ ] **Étape 2 : Tester l'inscription**

```bash
npm run dev
```

Tester `/inscription` : choisir locataire, remplir le formulaire, vérifier la redirection vers `/recherche`. Même test avec propriétaire → `/mes-logements`.

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/Register.tsx
git commit -m "feat: add 2-step register page for locataire and proprietaire"
```

---

## Task 6 — Hooks React Query

**Files:**
- Modify: `src/hooks/useLogements.ts`
- Create: `src/hooks/useLocataires.ts`
- Create: `src/hooks/useGroupes.ts`
- Create: `src/hooks/useCandidatures.ts`

- [ ] **Étape 1 : Mettre à jour `src/hooks/useLogements.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logementsApi, type LogementPayload } from '../api/logements';

export const useLogements = (params?: Parameters<typeof logementsApi.list>[0]) =>
  useQuery({
    queryKey: ['logements', params],
    queryFn: () => logementsApi.list(params),
  });

export const useLogement = (id: number) =>
  useQuery({
    queryKey: ['logement', id],
    queryFn: () => logementsApi.get(id),
    enabled: !!id,
  });

export const useCreateLogement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LogementPayload) => logementsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logements'] }),
  });
};

export const useUpdateLogement = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LogementPayload>) => logementsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['logements'] });
      qc.invalidateQueries({ queryKey: ['logement', id] });
    },
  });
};

export const useDeleteLogement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => logementsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logements'] }),
  });
};
```

- [ ] **Étape 2 : Créer `src/hooks/useLocataires.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';

export const useLocataires = (params?: { age_min?: number; age_max?: number; sexe?: string }) =>
  useQuery({
    queryKey: ['locataires', params],
    queryFn: () => usersApi.getLocataires(params),
  });
```

- [ ] **Étape 3 : Créer `src/hooks/useGroupes.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupesApi } from '../api/groupes';

export const useMesGroupes = () =>
  useQuery({
    queryKey: ['mes-groupes'],
    queryFn: () => groupesApi.getMes(),
  });

export const useCreateGroupe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { description?: string }) => groupesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};

export const useAddMembre = (groupeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (locataireId: number) => groupesApi.addMembre(groupeId, locataireId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};

export const useRemoveMembre = (groupeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (locataireId: number) => groupesApi.removeMembre(groupeId, locataireId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};

export const useDeleteGroupe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => groupesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mes-groupes'] }),
  });
};
```

- [ ] **Étape 4 : Créer `src/hooks/useCandidatures.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logementsApi } from '../api/logements';

export const useCandidatures = (logementId: number) =>
  useQuery({
    queryKey: ['candidatures', logementId],
    queryFn: () => logementsApi.getCandidatures(logementId),
    enabled: !!logementId,
  });

export const useAddCandidature = (logementId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { groupe_id: number; message?: string }) =>
      logementsApi.addCandidature(logementId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidatures', logementId] }),
  });
};

export const useValidateCandidature = (logementId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (groupeId: number) => logementsApi.validateCandidature(logementId, groupeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidatures', logementId] }),
  });
};
```

- [ ] **Étape 5 : Vérifier la compilation**

```bash
npm run build
```

- [ ] **Étape 6 : Commit**

```bash
git add src/hooks/
git commit -m "feat: add React Query hooks for logements, locataires, groupes, candidatures"
```

---

## Task 7 — Composants carte

**Files:**
- Create: `src/components/logement/LogementCard.tsx`
- Create: `src/components/locataire/LocataireCard.tsx`

- [ ] **Étape 1 : Créer `src/components/logement/LogementCard.tsx`**

```typescript
import type { Logement } from '../../types';

interface LogementCardProps {
  logement: Logement;
  action?: React.ReactNode;
}

export default function LogementCard({ logement, action }: LogementCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-syne font-bold text-dark-blue text-base">
            {logement.ville}
            {logement.quartier && <span className="text-gray-400 font-normal"> · {logement.quartier}</span>}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">{logement.code_postal}</p>
        </div>
        <p className="font-syne font-black text-dark-blue text-lg">{logement.prix} €<span className="text-xs font-normal text-gray-400">/mois</span></p>
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        {logement.superficie && (
          <span className="bg-blue-100 text-dark-blue text-xs px-3 py-1 rounded-full font-inter">
            {logement.superficie} m²
          </span>
        )}
        {logement.etage !== null && logement.etage !== undefined && (
          <span className="bg-blue-100 text-dark-blue text-xs px-3 py-1 rounded-full font-inter">
            Étage {logement.etage}
          </span>
        )}
        <span className={`text-xs px-3 py-1 rounded-full font-inter ${logement.meuble ? 'bg-orange-400/20 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
          {logement.meuble ? '✓ Meublé' : 'Non meublé'}
        </span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```

- [ ] **Étape 2 : Créer `src/components/locataire/LocataireCard.tsx`**

```typescript
import type { Locataire } from '../../types';

interface LocataireCardProps {
  locataire: Locataire;
  action?: React.ReactNode;
}

const sexeLabel: Record<string, string> = { M: 'Homme', F: 'Femme', A: 'Autre' };

export default function LocataireCard({ locataire, action }: LocataireCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-syne font-bold text-dark-blue text-base">{locataire.prenom} {locataire.nom}</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {locataire.age && (
              <span className="text-gray-500 text-xs">{locataire.age} ans</span>
            )}
            {locataire.sexe && (
              <span className="text-gray-500 text-xs">· {sexeLabel[locataire.sexe] ?? locataire.sexe}</span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-400 flex items-center justify-center text-white font-syne font-bold">
          {locataire.prenom[0]}
        </div>
      </div>
      {locataire.description && (
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{locataire.description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
```

- [ ] **Étape 3 : Vérifier la compilation**

```bash
npm run build
```

- [ ] **Étape 4 : Commit**

```bash
git add src/components/logement/ src/components/locataire/
git commit -m "feat: add LogementCard and LocataireCard components"
```

---

## Task 8 — Page Recherche (locataire)

**Files:**
- Modify: `src/pages/Recherche.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/Recherche.tsx`**

```typescript
import { useState } from 'react';
import { useLogements } from '../hooks/useLogements';
import { useAddCandidature } from '../hooks/useCandidatures';
import { useMesGroupes } from '../hooks/useGroupes';
import LogementCard from '../components/logement/LogementCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import type { Logement } from '../types';

export default function Recherche() {
  const [ville, setVille] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [meuble, setMeuble] = useState<boolean | undefined>(undefined);
  const [selectedLogement, setSelectedLogement] = useState<Logement | null>(null);
  const [message, setMessage] = useState('');
  const [selectedGroupeId, setSelectedGroupeId] = useState<number | ''>('');

  const filters = {
    ville: ville || undefined,
    prix_max: prixMax ? parseInt(prixMax) : undefined,
    meuble: meuble,
  };

  const { data: logements, isLoading } = useLogements(filters);
  const { data: mesGroupes } = useMesGroupes();
  const addCandidature = useAddCandidature(selectedLogement?.id_logement ?? 0);

  const monGroupe = mesGroupes?.[0];

  const handlePostuler = async () => {
    if (!selectedLogement || !selectedGroupeId) return;
    try {
      await addCandidature.mutateAsync({ groupe_id: Number(selectedGroupeId), message: message || undefined });
      setSelectedLogement(null);
      setMessage('');
    } catch {
      // error handled silently — toast system not yet implemented
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="font-syne font-black text-dark-blue text-2xl mb-6">Recherche</h1>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 space-y-3">
        <input
          type="text"
          placeholder="Ville..."
          value={ville}
          onChange={e => setVille(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="number"
          placeholder="Prix max (€/mois)"
          value={prixMax}
          onChange={e => setPrixMax(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex items-center gap-3">
          <span className="text-sm font-syne text-dark-blue">Meublé uniquement</span>
          <button
            type="button"
            onClick={() => setMeuble(m => m === true ? undefined : true)}
            className={`relative w-10 h-6 rounded-full transition-colors ${meuble ? 'bg-orange-400' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${meuble ? 'left-4.5 translate-x-0' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Liste */}
      {isLoading ? (
        <LoadingSpinner />
      ) : !logements?.length ? (
        <EmptyState
          title="Aucun logement trouvé"
          description="Essaie d'ajuster les filtres de recherche."
        />
      ) : (
        <div className="space-y-4">
          {logements.map(logement => (
            <LogementCard
              key={logement.id_logement}
              logement={logement}
              action={
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedLogement(logement);
                    setSelectedGroupeId(monGroupe?.id_group ?? '');
                  }}
                  className="w-full"
                >
                  Postuler
                </Button>
              }
            />
          ))}
        </div>
      )}

      {/* Modal postuler */}
      <Modal
        isOpen={!!selectedLogement}
        onClose={() => setSelectedLogement(null)}
        title="Postuler à ce logement"
      >
        {!monGroupe ? (
          <EmptyState
            title="Tu n'as pas encore de groupe"
            description="Crée ou rejoins un groupe depuis l'onglet Groupe pour pouvoir postuler."
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Logement : <span className="font-bold text-dark-blue">{selectedLogement?.ville}</span> — {selectedLogement?.prix} €/mois
            </p>
            <div className="space-y-1">
              <label className="text-sm font-syne font-medium text-dark-blue">Groupe</label>
              <select
                value={selectedGroupeId}
                onChange={e => setSelectedGroupeId(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {mesGroupes?.map(g => (
                  <option key={g.id_group} value={g.id_group}>
                    Groupe #{g.id_group} ({g.nombre_membres} membre{g.nombre_membres > 1 ? 's' : ''})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-syne font-medium text-dark-blue">Message (optionnel)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="Présentez-vous..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
            <Button
              onClick={handlePostuler}
              disabled={addCandidature.isPending || !selectedGroupeId}
              className="w-full"
            >
              {addCandidature.isPending ? 'Envoi...' : 'Envoyer la candidature'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
```

- [ ] **Étape 2 : Tester dans le navigateur (connecté en tant que locataire)**

```bash
npm run dev
```

Vérifier : liste de logements, filtres, modal postuler.

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/Recherche.tsx
git commit -m "feat: implement Recherche page with filters and candidature modal"
```

---

## Task 9 — Page Profils (locataire)

**Files:**
- Modify: `src/pages/Profils.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/Profils.tsx`**

```typescript
import { useState } from 'react';
import { useLocataires } from '../hooks/useLocataires';
import { useAddMembre, useMesGroupes } from '../hooks/useGroupes';
import LocataireCard from '../components/locataire/LocataireCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/auth';

export default function Profils() {
  const currentUser = useAuthStore(s => s.user);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sexe, setSexe] = useState('');

  const filters = {
    age_min: ageMin ? parseInt(ageMin) : undefined,
    age_max: ageMax ? parseInt(ageMax) : undefined,
    sexe: sexe || undefined,
  };

  const { data: locataires, isLoading } = useLocataires(filters);
  const { data: mesGroupes } = useMesGroupes();
  const monGroupe = mesGroupes?.[0];
  const addMembre = useAddMembre(monGroupe?.id_group ?? 0);

  const autres = locataires?.filter(l => l.id_user !== currentUser?.id_user);

  const handleInviter = async (locataireId: number) => {
    if (!monGroupe) return;
    try {
      await addMembre.mutateAsync(locataireId);
    } catch {
      // error handled silently
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="font-syne font-black text-dark-blue text-2xl mb-6">Profils</h1>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="number"
            placeholder="Âge min"
            value={ageMin}
            onChange={e => setAgeMin(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="number"
            placeholder="Âge max"
            value={ageMax}
            onChange={e => setAgeMax(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <select
          value={sexe}
          onChange={e => setSexe(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Tous les profils</option>
          <option value="M">Hommes</option>
          <option value="F">Femmes</option>
          <option value="A">Autre</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !autres?.length ? (
        <EmptyState title="Aucun profil trouvé" description="Essaie d'élargir les filtres." />
      ) : (
        <div className="space-y-4">
          {autres.map(locataire => (
            <LocataireCard
              key={locataire.id_user}
              locataire={locataire}
              action={
                monGroupe ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleInviter(locataire.id_locataire)}
                    disabled={addMembre.isPending}
                    className="w-full !text-dark-blue !border-dark-blue !bg-transparent hover:!bg-dark-blue/5"
                  >
                    Inviter dans mon groupe
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Étape 2 : Tester**

```bash
npm run dev
```

Vérifier la liste avec filtres et le bouton inviter (nécessite d'avoir un groupe).

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/Profils.tsx
git commit -m "feat: implement Profils page with filters and invite to group"
```

---

## Task 10 — Page Groupes (locataire)

**Files:**
- Modify: `src/pages/Groupes.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/Groupes.tsx`**

```typescript
import { useState } from 'react';
import { useMesGroupes, useCreateGroupe, useRemoveMembre, useDeleteGroupe } from '../hooks/useGroupes';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/auth';
import type { Groupe } from '../types';

export default function Groupes() {
  const currentUser = useAuthStore(s => s.user);
  const [description, setDescription] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data: groupes, isLoading } = useMesGroupes();
  const createGroupe = useCreateGroupe();
  const deleteGroupe = useDeleteGroupe();

  const monGroupe: Groupe | undefined = groupes?.[0];

  const removeMembre = useRemoveMembre(monGroupe?.id_group ?? 0);

  const handleCreate = async () => {
    try {
      await createGroupe.mutateAsync({ description: description || undefined });
      setDescription('');
      setShowCreate(false);
    } catch {
      // error handled silently
    }
  };

  const handleQuitter = async () => {
    if (!monGroupe || !currentUser) return;
    try {
      await removeMembre.mutateAsync(currentUser.id_user);
    } catch {
      // error handled silently
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="font-syne font-black text-dark-blue text-2xl mb-6">Mon groupe</h1>

      {!monGroupe ? (
        <>
          <EmptyState
            title="Tu n'as pas encore de groupe"
            description="Crée un groupe pour commencer à postuler à des logements ensemble."
            action={
              <Button onClick={() => setShowCreate(true)}>Créer un groupe</Button>
            }
          />
          {showCreate && (
            <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <h2 className="font-syne font-bold text-dark-blue">Nouveau groupe</h2>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description du groupe (optionnel)"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleCreate}
                  disabled={createGroupe.isPending}
                  className="flex-1"
                >
                  {createGroupe.isPending ? 'Création...' : 'Créer'}
                </Button>
                <Button variant="secondary" onClick={() => setShowCreate(false)} className="flex-1 !text-dark-blue !border-dark-blue">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {/* Info groupe */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-syne font-bold text-dark-blue">Groupe #{monGroupe.id_group}</p>
                <p className="text-gray-500 text-xs mt-0.5">{monGroupe.nombre_membres} membre{monGroupe.nombre_membres > 1 ? 's' : ''}</p>
              </div>
              <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-inter">Actif</span>
            </div>
            {monGroupe.description && (
              <p className="text-gray-600 text-sm mb-4">{monGroupe.description}</p>
            )}
            <Button
              size="sm"
              onClick={handleQuitter}
              disabled={removeMembre.isPending}
              className="w-full bg-red-50 !text-red-500 !rounded-xl hover:bg-red-100"
            >
              {removeMembre.isPending ? 'Départ...' : 'Quitter le groupe'}
            </Button>
          </div>

          {/* Candidatures envoyées */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-syne font-bold text-dark-blue mb-3">Candidatures envoyées</h2>
            <p className="text-gray-500 text-sm">Utilise l'onglet Recherche pour postuler à des logements.</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Étape 2 : Tester**

```bash
npm run dev
```

Vérifier : état sans groupe → créer → état avec groupe → quitter.

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/Groupes.tsx
git commit -m "feat: implement Groupes page with create and quit group"
```

---

## Task 11 — Page Profil (commun)

**Files:**
- Modify: `src/pages/Profil.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/Profil.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { usersApi } from '../api/users';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import type { Utilisateur } from '../types';

export default function Profil() {
  const navigate = useNavigate();
  const { user, setAuth, logout, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nom: user?.nom ?? '',
    prenom: user?.prenom ?? '',
    telephone: user?.telephone ?? '',
    age: '',
    sexe: '' as '' | 'M' | 'F' | 'A',
    description: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm(f => ({
      ...f,
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone ?? '',
    }));
    if (user.type === 'locataire') {
      const loc = user as typeof user & { age?: number; sexe?: string; description?: string };
      setForm(f => ({
        ...f,
        age: loc.age?.toString() ?? '',
        sexe: (loc.sexe as '' | 'M' | 'F' | 'A') ?? '',
        description: loc.description ?? '',
      }));
    }
  }, [user]);

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    setLoading(true);
    setSuccess(false);
    try {
      const payload = {
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone || undefined,
        ...(user.type === 'locataire' && {
          age: form.age ? parseInt(form.age) : undefined,
          sexe: (form.sexe as 'M' | 'F' | 'A') || undefined,
          description: form.description || undefined,
        }),
      };
      const res = await usersApi.update(user.id_user, payload);
      setAuth(token, res.user as Utilisateur);
      setSuccess(true);
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne font-black text-dark-blue text-2xl">Mon profil</h1>
        <span className="bg-blue-100 text-dark-blue text-xs px-3 py-1 rounded-full font-inter capitalize">
          {user?.type}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Prénom" value={form.prenom} onChange={set('prenom')} required />
          <FormField label="Nom" value={form.nom} onChange={set('nom')} required />
        </div>
        <FormField label="Téléphone" type="tel" value={form.telephone} onChange={set('telephone')} />

        {user?.type === 'locataire' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Âge" type="number" value={form.age} onChange={set('age')} min={18} max={99} />
              <div className="space-y-1">
                <label className="block text-sm font-syne font-medium text-dark-blue">Sexe</label>
                <select
                  value={form.sexe}
                  onChange={set('sexe')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">—</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                  <option value="A">Autre</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-syne font-medium text-dark-blue">Description</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
          </>
        )}

        {success && (
          <p className="text-green-600 text-sm">Profil mis à jour ✓</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </form>

      <button
        onClick={handleLogout}
        className="w-full text-red-500 text-sm font-syne font-bold py-3 border border-red-200 rounded-2xl hover:bg-red-50 transition-colors"
      >
        Se déconnecter
      </button>
    </div>
  );
}
```

- [ ] **Étape 2 : Vérifier**

```bash
npm run dev
```

Tester : affichage des infos, modification, sauvegarde, déconnexion.

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/Profil.tsx src/pages/Messages.tsx
git commit -m "feat: implement Profil page with edit and logout"
```

---

## Task 12 — Page Mes Logements (propriétaire)

**Files:**
- Modify: `src/pages/MesLogements.tsx`

> ⚠️ **Limitation backend** : L'API `GET /logements` ne filtre pas par propriétaire connecté (la table `proposer` n'est pas exposée). Cette page affiche **tous** les logements en attendant qu'un endpoint `GET /logements/mes-logements` soit ajouté côté backend.

- [ ] **Étape 1 : Réécrire `src/pages/MesLogements.tsx`**

```typescript
import { useNavigate } from 'react-router-dom';
import { useLogements, useDeleteLogement } from '../hooks/useLogements';
import LogementCard from '../components/logement/LogementCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function MesLogements() {
  const navigate = useNavigate();
  const { data: logements, isLoading } = useLogements();
  const deleteLogement = useDeleteLogement();

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce logement ?')) return;
    try {
      await deleteLogement.mutateAsync(id);
    } catch {
      // error handled silently
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne font-black text-dark-blue text-2xl">Mes logements</h1>
        <Button size="sm" onClick={() => navigate('/logements/nouveau')}>
          + Nouveau
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !logements?.length ? (
        <EmptyState
          title="Aucun logement"
          description="Ajoutez votre premier logement pour recevoir des candidatures."
          action={
            <Button onClick={() => navigate('/logements/nouveau')}>
              Ajouter un logement
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {logements.map(logement => (
            <LogementCard
              key={logement.id_logement}
              logement={logement}
              action={
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/logements/${logement.id_logement}/candidatures`)}
                    className="flex-1 !text-dark-blue !border-dark-blue !bg-transparent"
                  >
                    Candidatures
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/logements/${logement.id_logement}/modifier`)}
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <button
                    onClick={() => handleDelete(logement.id_logement)}
                    disabled={deleteLogement.isPending}
                    className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    🗑
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Étape 2 : Vérifier**

```bash
npm run dev
```

Connecté en tant que propriétaire, vérifier la liste et la navigation.

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/MesLogements.tsx
git commit -m "feat: implement MesLogements page for proprietaire"
```

---

## Task 13 — Page LogementForm (créer / modifier)

**Files:**
- Modify: `src/pages/LogementForm.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/LogementForm.tsx`**

```typescript
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLogement, useCreateLogement, useUpdateLogement } from '../hooks/useLogements';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LogementForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const logementId = id ? parseInt(id) : 0;

  const { data: existing, isLoading } = useLogement(logementId);
  const createLogement = useCreateLogement();
  const updateLogement = useUpdateLogement(logementId);

  const [form, setForm] = useState({
    code_postal: '',
    ville: '',
    quartier: '',
    prix: '',
    superficie: '',
    etage: '',
    meuble: false,
  });

  useEffect(() => {
    if (existing && isEdit) {
      setForm({
        code_postal: existing.code_postal,
        ville: existing.ville,
        quartier: existing.quartier ?? '',
        prix: existing.prix.toString(),
        superficie: existing.superficie ?? '',
        etage: existing.etage?.toString() ?? '',
        meuble: existing.meuble,
      });
    }
  }, [existing, isEdit]);

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code_postal: form.code_postal,
      ville: form.ville,
      quartier: form.quartier || undefined,
      prix: parseInt(form.prix),
      superficie: form.superficie || undefined,
      etage: form.etage ? parseInt(form.etage) : undefined,
      meuble: form.meuble,
    };
    try {
      if (isEdit) {
        await updateLogement.mutateAsync(payload);
      } else {
        await createLogement.mutateAsync(payload);
      }
      navigate('/mes-logements');
    } catch {
      // error handled silently
    }
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  const isPending = createLogement.isPending || updateLogement.isPending;

  return (
    <div className="px-4 pt-8 pb-4">
      <button onClick={() => navigate('/mes-logements')} className="text-sm text-gray-400 mb-6 flex items-center gap-1">
        ← Mes logements
      </button>
      <h1 className="font-syne font-black text-dark-blue text-2xl mb-6">
        {isEdit ? 'Modifier le logement' : 'Nouveau logement'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Code postal *" value={form.code_postal} onChange={set('code_postal')} required maxLength={5} />
          <FormField label="Ville *" value={form.ville} onChange={set('ville')} required />
        </div>
        <FormField label="Quartier" value={form.quartier} onChange={set('quartier')} />
        <FormField label="Prix (€/mois) *" type="number" value={form.prix} onChange={set('prix')} required min={0} />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Superficie (m²)" value={form.superficie} onChange={set('superficie')} />
          <FormField label="Étage" type="number" value={form.etage} onChange={set('etage')} min={0} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-syne font-medium text-dark-blue">Meublé</span>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, meuble: !f.meuble }))}
            className={`relative w-10 h-6 rounded-full transition-colors ${form.meuble ? 'bg-orange-400' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.meuble ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Créer le logement'}
        </Button>
      </form>
    </div>
  );
}
```

- [ ] **Étape 2 : Tester**

```bash
npm run dev
```

Tester : créer un logement, vérifier qu'il apparaît dans "Mes logements". Modifier un logement existant.

- [ ] **Étape 3 : Commit**

```bash
git add src/pages/LogementForm.tsx
git commit -m "feat: implement LogementForm page for create and edit"
```

---

## Task 14 — Page Candidatures (propriétaire)

**Files:**
- Modify: `src/pages/Candidatures.tsx`

- [ ] **Étape 1 : Réécrire `src/pages/Candidatures.tsx`**

```typescript
import { useNavigate, useParams } from 'react-router-dom';
import { useCandidatures, useValidateCandidature } from '../hooks/useCandidatures';
import { useLogement } from '../hooks/useLogements';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function Candidatures() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const logementId = parseInt(id ?? '0');

  const { data: logement } = useLogement(logementId);
  const { data: groupes, isLoading } = useCandidatures(logementId);
  const validateCandidature = useValidateCandidature(logementId);

  const handleValider = async (groupeId: number) => {
    try {
      await validateCandidature.mutateAsync(groupeId);
    } catch {
      // error handled silently
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <button onClick={() => navigate('/mes-logements')} className="text-sm text-gray-400 mb-4 flex items-center gap-1">
        ← Mes logements
      </button>
      <h1 className="font-syne font-black text-dark-blue text-xl mb-1">Candidatures</h1>
      {logement && (
        <p className="text-gray-500 text-sm mb-6">
          {logement.ville} — {logement.prix} €/mois
        </p>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : !groupes?.length ? (
        <EmptyState
          title="Aucune candidature"
          description="Les groupes intéressés par ce logement apparaîtront ici."
        />
      ) : (
        <div className="space-y-4">
          {groupes.map(groupe => (
            <div key={groupe.id_group} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-syne font-bold text-dark-blue">Groupe #{groupe.id_group}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {groupe.nombre_membres} membre{groupe.nombre_membres > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full font-inter">
                  En attente
                </span>
              </div>
              {groupe.description && (
                <p className="text-gray-600 text-sm mb-4">{groupe.description}</p>
              )}
              <Button
                size="sm"
                onClick={() => handleValider(groupe.id_group)}
                disabled={validateCandidature.isPending}
                className="w-full"
              >
                {validateCandidature.isPending ? 'Validation...' : '✓ Valider cette candidature'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Étape 2 : Tester**

```bash
npm run dev
```

Tester : depuis "Mes logements" → "Candidatures", vérifier la liste et le bouton valider.

- [ ] **Étape 3 : Vérification finale complète**

```bash
npm run build && npm run lint
```

Corriger toute erreur TypeScript ou ESLint avant le commit final.

- [ ] **Étape 4 : Commit final**

```bash
git add src/pages/Candidatures.tsx
git commit -m "feat: implement Candidatures page with validate action"
```

---

## Récapitulatif des endpoints requis non couverts

Ces fonctionnalités nécessitent des ajouts côté backend avant d'être implémentables :

| Fonctionnalité | Endpoint manquant |
|---|---|
| Filtrer logements par propriétaire | `GET /logements/mes-logements` (avec JWT) |
| Voir ses candidatures (locataire) | `GET /groupes/:id/candidatures` ou champ dans `groupe.to_dict()` |
| Système de matching/likes | `POST /users/locataires/:id/like`, `GET /users/locataires/matches` |
