import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/auth';
import PublicLayout from '../components/layout/PublicLayout';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import type { UserType } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [role, setRole] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nom: '', prenom: '', mail: '', password: '', telephone: '',
    age: '', sexe: '' as '' | 'M' | 'F' | 'A', description: '',
  });

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const setSelect = (field: string) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const setTextarea = (field: string) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
        <button onClick={() => setRole(null)} className="text-sm text-gray-400 mb-6 flex items-center gap-1 hover:text-gray-600">
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
                    onChange={setSelect('sexe')}
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
                  onChange={setTextarea('description')}
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
