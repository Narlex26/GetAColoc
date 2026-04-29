import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { usersApi } from '../api/users';
import type { Utilisateur, Sexe } from '../types';

function calcCompletion(user: Utilisateur & { age?: number; sexe?: Sexe; description?: string }): number {
  let score = 40; // nom + prenom toujours renseignés
  if (user.telephone) score += 20;
  if (user.type === 'locataire') {
    if (user.age) score += 15;
    if (user.sexe) score += 15;
    if (user.description) score += 10;
  } else {
    score = Math.min(score + 40, 100);
  }
  return Math.min(score, 100);
}

export default function Profil() {
  const navigate = useNavigate();
  const { user, setAuth, logout, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);

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
      setEditing(false);
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

  if (!user) return null;

  const locUser = user as Utilisateur & { age?: number; sexe?: Sexe; description?: string };
  const completion = calcCompletion(locUser);
  const fullName = `${user.prenom} ${user.nom}`;
  const initial = user.prenom.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      {/* Header bleu */}
      <header className="bg-dark-blue px-6 pt-8 pb-6 rounded-b-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-[72px] h-[72px] rounded-full bg-[#F7C67B] flex items-center justify-center">
              <span className="font-syne font-black text-2xl text-dark-blue">{initial}</span>
            </div>
            <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-orange-400 border-2 border-dark-blue" />
          </div>

          <h1 className="mt-4 font-syne font-extrabold text-xl text-white">{fullName}</h1>
          <p className="font-inter font-light text-[10px] text-blue-400 mt-1 capitalize">
            {user.type}
          </p>

          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 bg-white/5">
            <span className="w-1.5 h-2 rounded-full bg-[#29B95E]" />
            <span className="font-inter font-medium text-[10px] text-white">
              Profil actif — En recherche
            </span>
          </div>

          {/* Barre de complétude */}
          <div className="w-full mt-5 rounded-[10px] bg-[#395CA0]/60 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-inter font-semibold text-[10px] text-white">
                Complétude du profil
              </span>
              <span className="font-inter font-semibold text-[10px] text-orange-400">
                {completion}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-dark-blue via-orange-400 to-blue-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Premium */}
      <section className="px-6 mt-5">
        <div className="rounded-[15px] bg-gradient-to-r from-dark-blue to-[#4B7AD3] p-4 flex items-center gap-4">
          <svg width="23" height="19" viewBox="0 0 23 19" fill="none" className="flex-shrink-0">
            <path d="M11.5 0L14.08 6.56h8.36L15.68 10.62l2.58 6.57L11.5 13.13l-6.76 4.06 2.58-6.57L.56 6.56h8.36L11.5 0z" fill="#FFBD59" />
          </svg>
          <div>
            <h3 className="font-syne font-extrabold text-sm text-white">Passer à Premium</h3>
            <p className="font-inter font-medium text-[11px] text-white/60">
              Contacts illimités · Boost de profil · Sans pub
            </p>
          </div>
        </div>
      </section>

      {/* MON COMPTE */}
      <h2 className="font-inter font-semibold text-[10px] text-[#606060] uppercase px-6 mt-6 mb-2">
        MON COMPTE
      </h2>

      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="w-full px-6 py-3 flex items-center gap-4 text-left bg-[#D9D9D9]/10 border-b border-black/5 hover:bg-gray-50 transition"
        >
          <div className="w-7 h-6 rounded bg-[#56137D]/20 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-inter font-bold text-[10px] text-dark-blue">Modifier mon profil</p>
            <p className="font-inter font-medium text-[10px] text-[#606060]/80">
              Infos personnelles, bio
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-inter font-medium bg-orange-400/30 text-orange-400">
            {completion}%
          </span>
          <span className="text-[#606060]/90 font-inter">&gt;</span>
        </button>
      ) : (
        <form onSubmit={handleSave} className="px-6 py-4 space-y-4 border-b border-black/5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-syne font-medium text-dark-blue">Prénom</label>
              <input
                value={form.prenom}
                onChange={set('prenom')}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-syne font-medium text-dark-blue">Nom</label>
              <input
                value={form.nom}
                onChange={set('nom')}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-syne font-medium text-dark-blue">Téléphone</label>
            <input
              type="tel"
              value={form.telephone}
              onChange={set('telephone')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {user.type === 'locataire' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-syne font-medium text-dark-blue">Âge</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={set('age')}
                    min={18}
                    max={99}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-syne font-medium text-dark-blue">Sexe</label>
                  <select
                    value={form.sexe}
                    onChange={set('sexe')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">—</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                    <option value="A">Autre</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-syne font-medium text-dark-blue">Description</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </>
          )}

          {success && (
            <p className="text-[#29B95E] text-sm font-inter">Profil mis à jour ✓</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 h-10 rounded-full border border-dark-blue text-dark-blue font-syne font-bold text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-full bg-dark-blue text-white font-syne font-bold text-sm disabled:opacity-50"
            >
              {loading ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      )}

      {/* Déconnexion */}
      <div className="mt-3 bg-[#D9D9D9]/10">
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 flex items-center gap-4 text-left"
        >
          <div className="w-7 h-6 rounded bg-[#EF7B98]/30 flex-shrink-0" />
          <div>
            <p className="font-inter font-bold text-[10px] text-[#FF1818]">Se déconnecter</p>
            <p className="font-inter font-medium text-[10px] text-[#606060]/80">
              Retour à l'accueil
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
