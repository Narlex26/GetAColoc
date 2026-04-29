import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLogement, useCreateLogement, useUpdateLogement } from '../hooks/useLogements';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LogementForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const logementId = id ? parseInt(id) : 0;

  const { data: existing, isLoading } = useLogement(logementId);
  const createLogement = useCreateLogement();
  const updateLogement = useUpdateLogement(logementId);

  const [form, setForm] = useState({
    code_postal: '',
    ville: '',
    quartier: '',
    prix: '',
    superficie: '',
    etage: '',
    meuble: false,
  });

  useEffect(() => {
    if (existing && isEdit) {
      setForm({
        code_postal: existing.code_postal,
        ville: existing.ville,
        quartier: existing.quartier ?? '',
        prix: existing.prix.toString(),
        superficie: existing.superficie ?? '',
        etage: existing.etage?.toString() ?? '',
        meuble: existing.meuble,
      });
    }
  }, [existing, isEdit]);

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code_postal: form.code_postal,
      ville: form.ville,
      quartier: form.quartier || undefined,
      prix: parseInt(form.prix),
      superficie: form.superficie || undefined,
      etage: form.etage ? parseInt(form.etage) : undefined,
      meuble: form.meuble,
    };
    try {
      if (isEdit) {
        await updateLogement.mutateAsync(payload);
      } else {
        await createLogement.mutateAsync(payload);
      }
      navigate('/mes-logements');
    } catch {
      // erreur gérée silencieusement
    }
  };

  if (isEdit && isLoading) return <LoadingSpinner />;

  const isPending = createLogement.isPending || updateLogement.isPending;

  return (
    <div className="px-4 pt-8 pb-4">
      <button onClick={() => navigate('/mes-logements')} className="text-sm text-gray-400 mb-6 flex items-center gap-1 hover:text-gray-600">
        ← Mes logements
      </button>
      <h1 className="font-syne font-black text-dark-blue text-2xl mb-6">
        {isEdit ? 'Modifier le logement' : 'Nouveau logement'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Code postal *" value={form.code_postal} onChange={set('code_postal')} required maxLength={5} />
          <FormField label="Ville *" value={form.ville} onChange={set('ville')} required />
        </div>
        <FormField label="Quartier" value={form.quartier} onChange={set('quartier')} />
        <FormField label="Prix (€/mois) *" type="number" value={form.prix} onChange={set('prix')} required min={0} />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Superficie (m²)" value={form.superficie} onChange={set('superficie')} />
          <FormField label="Étage" type="number" value={form.etage} onChange={set('etage')} min={0} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-syne font-medium text-dark-blue">Meublé</span>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, meuble: !f.meuble }))}
            className={`relative w-10 h-6 rounded-full transition-colors ${form.meuble ? 'bg-orange-400' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.meuble ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Sauvegarde...' : isEdit ? 'Mettre à jour' : 'Créer le logement'}
        </Button>
      </form>
    </div>
  );
}
