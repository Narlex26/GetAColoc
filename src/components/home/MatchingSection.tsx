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
  avatarColor: string;
}

const profiles: Profile[] = [
  {
    name: 'Léa',
    age: 24,
    status: 'Étudiante en Master',
    traits: ['Calme', 'Non fumeur', 'Organisée'],
    compatibility: 94,
    avatarColor: 'bg-dark-blue',
  },
  {
    name: 'Thomas',
    age: 27,
    status: 'Jeune actif en CDI',
    traits: ['Sociable', 'Organisée'],
    compatibility: 87,
    avatarColor: 'bg-white',
  },
];

const compatibilityScores: CompatibilityScore[] = [
  { category: 'Mode de vie', percentage: 96 },
  { category: 'Budget', percentage: 88 },
  { category: 'Localisation', percentage: 100 },
  { category: 'Règles de vie', percentage: 75 },
  { category: 'Règles de vie', percentage: 91 },
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
            Découvre des profils compatibles avec toi dès maintenant
          </p>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.name} className="p-6 overflow-hidden">
                {/* Profile Header */}
                <div className={`${profile.avatarColor} rounded-lg h-48 mb-4 flex items-center justify-center relative`}>
                  <div
                    className="absolute inset-0 rounded-lg opacity-50 bg-gray-300"
                    style={{ backgroundImage: 'url(/placeholder)' }}
                  ></div>
                  <div className="absolute top-3 right-3 bg-orange-400 text-dark-blue rounded-full px-3 py-1 text-sm font-syne font-bold">
                    {profile.compatibility}%
                  </div>
                </div>

                {/* Profile Info */}
                <h3 className={`text-lg font-syne font-bold mb-1 ${profile.avatarColor === 'bg-dark-blue' ? 'text-white' : 'text-dark-blue'}`}>
                  {profile.name}, {profile.age}
                </h3>
                <p className={`text-sm font-syne font-medium mb-4 ${profile.avatarColor === 'bg-dark-blue' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {profile.status}
                </p>

                {/* Traits */}
                <div className="flex flex-wrap gap-2">
                  {profile.traits.map((trait) => (
                    <span
                      key={trait}
                      className={`px-3 py-1 rounded-full text-xs font-inter font-medium ${
                        profile.avatarColor === 'bg-dark-blue'
                          ? 'bg-blue-200 bg-opacity-20 text-white text-opacity-80'
                          : 'bg-blue-100 text-dark-blue text-opacity-80'
                      }`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </Card>
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
            Notre moteur croise tes critères avec ceux des autres profils pour un score précis
          </p>

          {/* Compatibility Card */}
          <Card className="p-6 sm:p-8 bg-white">
            <h3 className="text-2xl font-syne font-black text-dark-blue mb-2">
              Score de compatibilité
            </h3>
            <p className="text-sm text-gray-500 font-syne font-semibold mb-6">
              Basé sur 60 + critères croisés entre profils
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
                  <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
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
