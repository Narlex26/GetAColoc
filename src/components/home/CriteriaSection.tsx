import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

interface CriteriaTag {
  label: string;
}

const locationTags: CriteriaTag[] = [
  { label: 'Hypercentre' },
  { label: 'Quartier calme' },
  { label: 'Zone étudiante' },
  { label: 'Transports proche' },
  { label: 'Desservi la nuit' },
  { label: 'Proche commerces' },
];

export default function CriteriaSection() {
  return (
    <section className="bg-gray-400 bg-opacity-70 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl space-y-8 sm:space-y-12">
        {/* Section 1: Search */}
        <div className="space-y-6">
          <Badge>🔍 Recherche</Badge>
          <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
            Où veux-tu habiter ?
          </h2>
          <p className="text-base sm:text-lg text-blue-600 font-syne font-medium max-w-md">
            Renseigne tes critères pour démarrer ta recherche.
          </p>

          {/* Search Card */}
          <Card className="p-6 sm:p-8 bg-dark-blue">
            <div className="space-y-6">
              <div>
                <label className="text-sm text-blue-300 font-syne font-medium block mb-2">
                  Ville ou quartier
                </label>
                <input
                  type="text"
                  placeholder="Ex: Paris 11e"
                  className="w-full px-4 py-3 rounded-xl border border-blue-300 border-opacity-20 bg-blue-300 bg-opacity-10 text-white placeholder-blue-300 placeholder-opacity-50 font-syne text-sm focus:outline-none focus:border-orange-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-blue-300 font-syne font-medium block mb-2">
                    Budget max
                  </label>
                  <input
                    type="text"
                    placeholder="700€/mois"
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 border-opacity-20 bg-blue-300 bg-opacity-10 text-white placeholder-blue-300 placeholder-opacity-50 font-syne text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-300 font-syne font-medium block mb-2">
                    Nb de colocs
                  </label>
                  <input
                    type="text"
                    placeholder="2 à 3"
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 border-opacity-20 bg-blue-300 bg-opacity-10 text-white placeholder-blue-300 placeholder-opacity-50 font-syne text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <Button variant="primary" size="md" className="w-full">
                🔍 Rechercher des logements
              </Button>
            </div>
          </Card>
        </div>

        {/* Section 2: Personalization */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
            Personnalise ta recherche
          </h2>
          <p className="text-base sm:text-lg text-blue-600 font-syne font-medium max-w-md">
            Configure tes préférences étape par étape, sans te noyer dans les options.
          </p>

          {/* Criteria Card */}
          <Card className="p-6 sm:p-8 bg-white">
            <div className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-syne font-bold text-dark-blue mb-4">
                  📍 Localisation
                </h3>
                <p className="text-sm text-dark-blue font-syne font-bold mb-4">
                  Où veux-tu habiter ?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {locationTags.map((tag) => (
                    <button
                      key={tag.label}
                      className="px-3 py-2 rounded-4xl border border-blue-300 text-dark-blue text-xs font-syne font-medium hover:bg-blue-100 transition-colors"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 mt-6 pt-6 flex justify-center">
              <Button size="md" className="px-8">
                Continuer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
