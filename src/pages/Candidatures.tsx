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
      // erreur gérée silencieusement
    }
  };

  return (
    <div className="px-4 pt-8 pb-4">
      <button onClick={() => navigate('/mes-logements')} className="text-sm text-gray-400 mb-4 flex items-center gap-1 hover:text-gray-600">
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
