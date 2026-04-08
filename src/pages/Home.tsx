import { useLogements } from "../hooks/useLogements";

export default function Home() {
  const { data, isLoading, error } = useLogements();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">GetAColoc</h1>
      <p className="text-gray-600 mb-6">
        Page d'accueil — à remplacer par l'export Builder.io de la maquette Figma.
      </p>

      {isLoading && <p>Chargement…</p>}
      {error && <p className="text-red-600">Erreur API : vérifier que le backend tourne sur {import.meta.env.VITE_API_URL}</p>}
      {data && (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((l) => (
            <li key={l.id} className="border rounded-lg p-4">
              <h2 className="font-semibold">{l.titre}</h2>
              <p className="text-sm text-gray-500">{l.ville}</p>
              {l.prix && <p className="mt-2">{l.prix} €</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
