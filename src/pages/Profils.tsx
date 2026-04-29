import { useLocataires } from '../hooks/useLocataires';
import { useAddMembre, useMesGroupes } from '../hooks/useGroupes';
import LocataireCard from '../components/locataire/LocataireCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/auth';
import { useState } from 'react';
import type { Sexe } from '../types';

export default function Profils() {
  const currentUser = useAuthStore(s => s.user);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sexe, setSexe] = useState<Sexe | ''>('');

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
      // erreur gérée silencieusement
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="font-syne font-black text-dark-blue text-2xl mb-6">Profils</h1>

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
          onChange={e => setSexe(e.target.value as Sexe | '')}
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
                    onClick={() => handleInviter(locataire.id_locataire)}
                    disabled={addMembre.isPending}
                    className="w-full"
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
