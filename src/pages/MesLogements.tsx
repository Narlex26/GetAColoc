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
    if (!window.confirm('Supprimer ce logement ?')) return;
    try {
      await deleteLogement.mutateAsync(id);
    } catch {
      // erreur gérée silencieusement
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
                    onClick={() => navigate(`/logements/${logement.id_logement}/candidatures`)}
                    className="flex-1"
                  >
                    Candidatures
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/logements/${logement.id_logement}/modifier`)}
                    className="flex-1 !text-dark-blue !border-dark-blue !bg-transparent hover:!bg-dark-blue hover:!text-white"
                  >
                    Modifier
                  </Button>
                  <button
                    onClick={() => handleDelete(logement.id_logement)}
                    disabled={deleteLogement.isPending}
                    className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-lg"
                    title="Supprimer"
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
