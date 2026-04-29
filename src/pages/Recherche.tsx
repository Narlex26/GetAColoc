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
      // erreur gérée silencieusement
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <h1 className="font-syne font-black text-dark-blue text-2xl mb-6">Recherche</h1>

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
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${meuble ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

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
