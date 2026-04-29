import { useState } from 'react';
import { useMesGroupes, useCreateGroupe, useRemoveMembre } from '../hooks/useGroupes';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/auth';

export default function Groupes() {
  const currentUser = useAuthStore(s => s.user);
  const [description, setDescription] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data: groupes, isLoading } = useMesGroupes();
  const createGroupe = useCreateGroupe();

  const monGroupe = groupes?.[0];
  const removeMembre = useRemoveMembre(monGroupe?.id_group ?? 0);

  const handleCreate = async () => {
    try {
      await createGroupe.mutateAsync({ description: description || undefined });
      setDescription('');
      setShowCreate(false);
    } catch {
      // erreur gérée silencieusement
    }
  };

  const handleQuitter = async () => {
    if (!monGroupe || !currentUser) return;
    try {
      await removeMembre.mutateAsync(currentUser.id_user);
    } catch {
      // erreur gérée silencieusement
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
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 border border-gray-200 rounded-full py-3 text-sm font-syne font-bold text-dark-blue hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-syne font-bold text-dark-blue">Groupe #{monGroupe.id_group}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {monGroupe.nombre_membres} membre{monGroupe.nombre_membres > 1 ? 's' : ''}
                </p>
              </div>
              <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-inter">Actif</span>
            </div>
            {monGroupe.description && (
              <p className="text-gray-600 text-sm mb-4">{monGroupe.description}</p>
            )}
            <button
              onClick={handleQuitter}
              disabled={removeMembre.isPending}
              className="w-full py-2.5 text-sm font-syne font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {removeMembre.isPending ? 'Départ...' : 'Quitter le groupe'}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-syne font-bold text-dark-blue mb-3">Candidatures envoyées</h2>
            <p className="text-gray-500 text-sm">Utilise l'onglet Recherche pour postuler à des logements.</p>
          </div>
        </div>
      )}
    </div>
  );
}
