import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { usersApi } from '../api/users';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import type { Utilisateur, Sexe } from '../types';

export default function Profil() {
  const navigate = useNavigate();
  const { user, setAuth, logout, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    age: '',
    sexe: '' as '' | Sexe,
    description: '',
  });

  useEffect(() => {
    if (!user) return;
    const loc = user as Utilisateur & { age?: number; sexe?: Sexe; description?: string };
    setForm({
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone ?? '',
      age: loc.age?.toString() ?? '',
      sexe: loc.sexe ?? '',
      description: loc.description ?? '',
    });
  }, [user]);

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
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
          sexe: (form.sexe as Sexe) || undefined,
          description: form.description || undefined,
        }),
      };
      const res = await usersApi.update(user.id_user, payload);
      setAuth(token, res.user as Utilisateur);
      setSuccess(true);
    } catch {
      // erreur gérée silencieusement
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
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
          </>
        )}

        {success && <p className="text-green-600 text-sm">Profil mis à jour ✓</p>}

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
