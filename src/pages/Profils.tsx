import { useState } from 'react';
import { useLocataires } from '../hooks/useLocataires';
import { useAddMembre, useMesGroupes } from '../hooks/useGroupes';
import { useAuthStore } from '../store/auth';
import type { Sexe } from '../types';

type SexeFilter = '' | Sexe;

const sexeFilters: { label: string; value: SexeFilter }[] = [
  { label: 'Tous les profils', value: '' },
  { label: 'Femmes', value: 'F' },
  { label: 'Hommes', value: 'M' },
  { label: 'Autre', value: 'A' },
];

const avatarColor = (sexe?: Sexe) => {
  if (sexe === 'F') return 'bg-[#F7C67B]';
  if (sexe === 'M') return 'bg-blue-300';
  return 'bg-green-200';
};

export default function Profils() {
  const currentUser = useAuthStore(s => s.user);
  const [sexe, setSexe] = useState<SexeFilter>('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  const { data: locataires, isLoading, error } = useLocataires({
    sexe: sexe || undefined,
    age_min: ageMin ? parseInt(ageMin) : undefined,
    age_max: ageMax ? parseInt(ageMax) : undefined,
  });

  const { data: mesGroupes } = useMesGroupes();
  const monGroupe = mesGroupes?.[0];
  const addMembre = useAddMembre(monGroupe?.id_group ?? 0);

  const autres = locataires?.filter(l => l.id_user !== currentUser?.id_user);

  const handleInviter = async (locataireId: number) => {
    if (!monGroupe) return;
    try {
      await addMembre.mutateAsync(locataireId);
    } catch {
      // erreur gérée silencieusement
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-dark-blue px-6 pt-10 pb-6">
        <h1 className="font-syne font-extrabold text-2xl text-white">Tes profils</h1>
        <p className="font-inter text-sm text-blue-300 mt-2">
          {autres?.length ? `${autres.length} profil${autres.length > 1 ? 's' : ''} trouvé${autres.length > 1 ? 's' : ''}` : 'Recherche en cours…'}
        </p>
      </header>

      {/* Filtres sexe */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto border-b border-black/10">
        {sexeFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setSexe(f.value)}
            className={`px-4 py-2 rounded-full font-syne font-medium text-xs whitespace-nowrap transition ${
              sexe === f.value
                ? 'bg-dark-blue text-white'
                : 'border border-blue-300 text-dark-blue'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Filtres âge */}
      <div className="px-6 py-3 flex gap-3 border-b border-black/5">
        <input
          type="number"
          placeholder="Âge min"
          value={ageMin}
          onChange={e => setAgeMin(e.target.value)}
          className="w-28 h-9 rounded-full border border-gray-200 px-4 font-syne text-xs text-dark-blue focus:outline-none focus:border-orange-400"
        />
        <input
          type="number"
          placeholder="Âge max"
          value={ageMax}
          onChange={e => setAgeMax(e.target.value)}
          className="w-28 h-9 rounded-full border border-gray-200 px-4 font-syne text-xs text-dark-blue focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* Liste */}
      <ul className="px-6 py-5 space-y-4">
        {isLoading && (
          <p className="text-center text-[#606060] font-syne py-8">Chargement…</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-syne text-sm py-8">
            Impossible de charger les profils.
          </p>
        )}

        {autres?.map(loc => (
          <li
            key={loc.id_user}
            className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center ${avatarColor(loc.sexe)}`}>
                <span className="font-syne font-bold text-xl text-dark-blue">
                  {loc.prenom.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-syne font-bold text-base text-dark-blue">
                  {loc.prenom}{loc.age ? `, ${loc.age}` : ''}
                </h3>
                <p className="font-inter text-xs text-[#606060]">
                  {loc.sexe === 'F' ? 'Femme' : loc.sexe === 'M' ? 'Homme' : loc.sexe === 'A' ? 'Autre' : ''}
                </p>

                {loc.description && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {loc.description.split(/[,;·]/).slice(0, 3).map((trait, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-blue-100 font-inter text-[10px] text-dark-blue"
                      >
                        {trait.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {monGroupe && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleInviter(loc.id_locataire)}
                      disabled={addMembre.isPending}
                      className="w-full h-9 rounded-full bg-dark-blue text-white font-syne font-bold text-xs disabled:opacity-50"
                    >
                      Inviter dans mon groupe
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}

        {!isLoading && !error && !autres?.length && (
          <p className="text-center text-[#606060] font-syne mt-8">Aucun profil trouvé.</p>
        )}
      </ul>
    </div>
  );
}
