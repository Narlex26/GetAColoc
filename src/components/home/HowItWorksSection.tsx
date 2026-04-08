interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Crée ton profil en 2 min',
    description: 'Statut, personnalité, habitudes, budget... on analyse tout pour mieux te matcher.',
  },
  {
    number: 2,
    title: 'Découvre tes matches',
    description: 'Notre IA sélectionne les profils les plus compatibles avec toi selon tes critères.',
  },
  {
    number: 3,
    title: 'Forme ton groupe',
    description: 'Invite tes futurs colocs dans le groupe et planifiez votre recherche ensemble.',
  },
  {
    number: 4,
    title: 'Postule ensemble',
    description: 'Un dossier commun, plus de force face aux propriétaires. Plus de chances!',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-dark-blue py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-syne font-black text-white leading-tight">
            De zéro à ta coloc en 4 étapes
          </h2>
          <p className="text-base sm:text-lg text-blue-400 font-syne font-semibold max-w-md">
            Basé sur 60 + critères croisés entre profils
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={step.number} className="relative pb-12 last:pb-0">
              {/* Timeline */}
              <div className="absolute left-6 sm:left-12 top-0 bottom-0 flex flex-col items-center">
                {/* Circle */}
                <div className="w-12 h-12 rounded-full bg-orange-400 bg-opacity-50 flex items-center justify-center border-4 border-orange-400 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                    <span className="text-dark-blue font-syne font-black text-lg">
                      {step.number}
                    </span>
                  </div>
                </div>
                {/* Line to next step */}
                {index < steps.length - 1 && (
                  <div className="w-1 flex-1 bg-orange-400 bg-opacity-50 mt-4"></div>
                )}
              </div>

              {/* Content */}
              <div className="ml-28 sm:ml-40">
                <h3 className="text-lg sm:text-2xl font-syne font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-blue-400 font-syne font-semibold leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
