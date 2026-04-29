import Badge from '../common/Badge';
import Card from '../common/Card';

interface CompatibilityScore {
  category: string;
  percentage: number;
}

interface Profile {
  name: string;
  age: number;
  status: string;
  traits: string[];
  compatibility: number;
  dark: boolean;
}

const profiles: Profile[] = [
  {
    name: 'Léa',
    age: 24,
    status: 'Étudiante en Master',
    traits: ['Calme', 'Non fumeur', 'Organisée'],
    compatibility: 94,
    dark: true,
  },
  {
    name: 'Thomas',
    age: 27,
    status: 'Jeune actif en CDI',
    traits: ['Sociable', 'Organisé'],
    compatibility: 88,
    dark: false,
  },
];

const compatibilityScores: CompatibilityScore[] = [
  { category: 'Mode de vie', percentage: 96 },
  { category: 'Budget', percentage: 88 },
  { category: 'Localisation', percentage: 100 },
  { category: 'Règles de vie', percentage: 75 },
  { category: 'Personnalité', percentage: 91 },
];

export default function MatchingSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl space-y-12">
        {/* Profiles Section */}
        <div className="space-y-6">
          <Badge>PROFILS</Badge>
          <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
            Des colocs qui te ressemblent
          </h2>
          <p className="text-base sm:text-lg text-blue-600 font-syne font-medium max-w-md">
            Découvre des profils compatibles avec toi dès maintenant.
          </p>

          {/* Profile Cards */}
          <div className="grid grid-cols-2 gap-3">
            {profiles.map((profile) => (
              <div
                key={profile.name}
                className={`rounded-2xl p-4 relative ${
                  profile.dark
                    ? 'bg-dark-blue text-white'
                    : 'bg-white border border-gray-200 text-dark-blue'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-full ${
                      profile.dark ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                    }`}
                  />
                  <span className="bg-orange-400 text-dark-blue text-xs font-syne font-medium px-2 py-0.5 rounded-full">
                    {profile.compatibility}%
                  </span>
                </div>

                <h4 className="mt-3 font-syne font-bold text-base">
                  {profile.name}, {profile.age}
                </h4>
                <p className={`font-inter text-sm ${profile.dark ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
                  {profile.status}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {profile.traits.map((trait) => (
                    <span
                      key={trait}
                      className={`text-xs font-inter px-2 py-0.5 rounded-full ${
                        profile.dark
                          ? 'bg-white bg-opacity-20 text-white text-opacity-80'
                          : 'bg-blue-100 text-dark-blue text-opacity-80'
                      }`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matching Section */}
        <div className="space-y-6">
          <Badge variant="medium">IA & MATCHING</Badge>
          <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
            L'IA qui fait le match pour toi
          </h2>
          <p className="text-base sm:text-lg text-blue-600 font-syne font-medium max-w-md">
            Notre moteur croise tes critères avec ceux des autres profils pour un score précis.
          </p>

          {/* Compatibility Card */}
          <Card className="p-6 sm:p-8 bg-white">
            <h3 className="text-2xl font-syne font-black text-dark-blue mb-2">
              Score de compatibilité
            </h3>
            <p className="text-sm text-gray-500 font-syne font-semibold mb-6">
              Basé sur 60+ critères croisés entre profils
            </p>

            <div className="space-y-6">
              {compatibilityScores.map((score, idx) => (
                <div key={`${score.category}-${idx}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base font-syne font-bold text-dark-blue">
                      {score.category}
                    </span>
                    <span className="text-sm font-syne font-bold text-dark-blue">
                      {score.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-dark-blue via-blue-500 to-orange-400 h-full rounded-full transition-all"
                      style={{ width: `${score.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
