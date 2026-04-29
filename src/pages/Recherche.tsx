import { useState } from 'react';
import { useLogements } from '../hooks/useLogements';
import { useAddCandidature } from '../hooks/useCandidatures';
import { useMesGroupes } from '../hooks/useGroupes';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import type { Logement } from '../types';

const meubleFilters = ['Tous', 'Meublé'];

export default function Recherche() {
  const [query, setQuery] = useState('');
  const [meubleTab, setMeubleTab] = useState('Tous');
  const [prixMax, setPrixMax] = useState('');
  const [selectedLogement, setSelectedLogement] = useState<Logement | null>(null);
  const [message, setMessage] = useState('');
  const [selectedGroupeId, setSelectedGroupeId] = useState<number | ''>('');

  const filters = {
    ville: query || undefined,
    prix_max: prixMax ? parseInt(prixMax) : undefined,
    meuble: meubleTab === 'Meublé' ? true : undefined,
  };

  const { data: logements, isLoading, error } = useLogements(filters);
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
    <div className="min-h-screen bg-white">
      <header className="bg-dark-blue px-6 pt-10 pb-6">
        <h1 className="font-syne font-extrabold text-2xl text-white">Recherche logement</h1>

        <div className="mt-5 relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ville, quartier…"
            className="w-full h-12 rounded-full bg-white/10 border border-blue-300/30 px-5 font-syne text-sm text-white placeholder:text-blue-300 focus:outline-none focus:border-orange-400"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto">
          {meubleFilters.map(t => (
            <button
              key={t}
              onClick={() => setMeubleTab(t)}
              className={`px-4 py-2 rounded-full font-syne font-medium text-xs whitespace-nowrap transition ${
                meubleTab === t
                  ? 'bg-orange-400 text-dark-blue'
                  : 'border border-blue-300/40 text-blue-300'
              }`}
            >
              {t}
            </button>
          ))}
          <input
            type="number"
            placeholder="Prix max €"
            value={prixMax}
            onChange={e => setPrixMax(e.target.value)}
            className="ml-auto w-28 h-9 rounded-full bg-white/10 border border-blue-300/30 px-4 font-syne text-xs text-white placeholder:text-blue-300 focus:outline-none focus:border-orange-400"
          />
        </div>
      </header>

      <main className="px-6 py-5">
        {isLoading && (
          <p className="text-center text-[#606060] font-syne py-12">Chargement…</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-syne text-sm py-12">
            Impossible de charger les logements.
          </p>
        )}

        <ul className="space-y-4">
          {logements?.map(l => (
            <li
              key={l.id_logement}
              className="rounded-2xl border border-blue-100 overflow-hidden shadow-sm"
            >
              <div className="h-36 bg-[#D9D9D9] relative flex items-center justify-center">
                <span className="font-syne font-bold text-2xl text-gray-400">
                  {l.ville.charAt(0).toUpperCase()}
                </span>
                <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[#29B95E] text-white font-syne font-bold text-[10px]">
                  Disponible
                </span>
                {l.meuble && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-orange-400 text-dark-blue font-syne font-bold text-[10px]">
                    Meublé
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-syne font-bold text-base text-dark-blue">
                  {l.ville}{l.quartier ? ` — ${l.quartier}` : ''}
                </h3>
                <p className="font-inter text-xs text-[#606060] mt-1">
                  {l.code_postal}{l.superficie ? ` · ${l.superficie} m²` : ''}
                  {l.etage != null ? ` · Étage ${l.etage}` : ''}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-syne font-extrabold text-lg text-dark-blue">
                    {l.prix} €/mois
                  </span>
                  <button
                    onClick={() => {
                      setSelectedLogement(l);
                      setSelectedGroupeId(monGroupe?.id_group ?? '');
                    }}
                    className="px-4 py-2 rounded-full bg-dark-blue text-white font-syne font-bold text-xs"
                  >
                    Postuler
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {!isLoading && !error && !logements?.length && (
          <EmptyState title="Aucun logement trouvé" description="Essaie d'ajuster les filtres." />
        )}
      </main>

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
                placeholder="Présentez-vous…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
            <Button
              onClick={handlePostuler}
              disabled={addCandidature.isPending || !selectedGroupeId}
              className="w-full"
            >
              {addCandidature.isPending ? 'Envoi…' : 'Envoyer la candidature'}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
