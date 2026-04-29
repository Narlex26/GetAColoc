import Badge from '../common/Badge';
import Card from '../common/Card';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '🤝',
    title: 'Crée ou rejoins un groupe',
    description: 'Forme ton équipe et postule ensemble à des logements. Plus de force, plus de chances.',
  },
  {
    icon: '🧠',
    title: 'Matching IA intelligent',
    description: 'Notre algorithme analyse 60+ critères pour te connecter avec les profils vraiment compatibles.',
  },
  {
    icon: '💬',
    title: 'Messagerie intégrée',
    description: "Échange directement avec tes futurs colocs avant de t'engager.",
  },
  {
    icon: '🏠',
    title: 'Annonces vérifiées',
    description: 'Des propriétaires de confiance avec des logements authentiques et détaillés.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <Badge>✦ Fonctionnalités</Badge>
            <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
              Tout pour trouver la bonne coloc
            </h2>
            <p className="text-base sm:text-lg text-blue-600 font-syne font-medium max-w-md">
              Une app pensée pour toi, de la recherche à l'emménagement.
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-4 sm:space-y-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 sm:p-8 border-2 border-gray-300">
                <div className="flex gap-4 sm:gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-400 bg-opacity-50 flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-syne font-bold text-dark-blue mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-blue-600 font-syne font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
