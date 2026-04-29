import { useState } from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

type Profil = 'Etudiants' | 'Actifs' | 'Mixte';
type Genre = 'Femmes' | 'Hommes';

interface Preferences {
  localisation: string[];
  budget: number;
  nbColocs: number;
  profil: Profil | null;
  genre: Genre | null;
  rules: string[];
}

const initialPrefs: Preferences = {
  localisation: [],
  budget: 600,
  nbColocs: 2,
  profil: null,
  genre: null,
  rules: [],
};

const locationTags = [
  'Hypercentre',
  'Quartier calme',
  'Zone étudiante',
  'Transports proche',
  'Desservi la nuit',
  'Proche commerces',
];

const budgetSteps = [200, 400, 600, 800, 1000, 1500];
const colocsOptions = [1, 2, 3, 4, 5];
const profilOptions: Profil[] = ['Etudiants', 'Actifs', 'Mixte'];
const genreOptions: Genre[] = ['Femmes', 'Hommes'];

const ruleGroups: { left: string; right: string }[] = [
  { left: 'Sans tabac', right: 'Tabac ok' },
  { left: 'Sans animaux', right: 'Animaux ok' },
  { left: 'Zéro fêtes', right: 'Soirée ok' },
  { left: "Pas d'invité", right: 'Invité limité' },
  { left: 'Solo', right: 'Couple ok' },
];

export default function CriteriaSection() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [prefs, setPrefs] = useState<Preferences>(initialPrefs);

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const next = () => setStep(s => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));

  return (
    <section className="bg-gray-400 bg-opacity-70 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl space-y-8 sm:space-y-12">
        {/* Section 1: Search */}
        <div className="space-y-6">
          <Badge>Recherche</Badge>
          <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
            Où veux-tu habiter ?
          </h2>
          <p className="text-base sm:text-lg text-blue-600 font-syne font-medium max-w-md">
            Renseigne tes critères pour démarrer ta recherche.
          </p>

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
                Rechercher des logements
              </Button>
            </div>
          </Card>
        </div>

        {/* Section 2: Personnalisation multi-étapes */}
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
            Personnalise ta recherche
          </h2>
          <p className="text-base sm:text-lg text-blue-600 font-syne font-medium max-w-md">
            Configure tes préférences étape par étape, sans te noyer dans les options.
          </p>

          <Card className="p-6 sm:p-8 bg-white">
            {/* Stepper */}
            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3].map(n => (
                <div
                  key={n}
                  className={`flex-1 h-1 rounded-lg ${n <= step ? 'bg-dark-blue' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <p className="font-syne font-medium text-xs text-gray-500 mb-6">
              Étape {step} sur 3
            </p>

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-syne font-bold text-dark-blue mb-2">
                    Localisation
                  </h3>
                  <p className="text-sm text-dark-blue font-syne font-bold mb-4">
                    Où veux-tu habiter ?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {locationTags.map(tag => {
                      const active = prefs.localisation.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setPrefs(p => ({ ...p, localisation: toggle(p.localisation, tag) }))}
                          className={`px-3 py-2 rounded-full border text-xs font-syne font-medium transition-colors ${
                            active
                              ? 'bg-dark-blue text-white border-dark-blue'
                              : 'border-blue-300 text-dark-blue hover:bg-blue-100'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-syne font-bold text-dark-blue mb-2">Budget</h3>
                  <p className="text-sm text-dark-blue font-syne font-bold mb-4">
                    Quel budget maximum ?
                  </p>
                  <input
                    type="range"
                    min={200}
                    max={1500}
                    step={50}
                    value={prefs.budget}
                    onChange={e => setPrefs(p => ({ ...p, budget: Number(e.target.value) }))}
                    className="w-full accent-dark-blue"
                  />
                  <div className="flex justify-between text-[10px] font-syne text-gray-500 mt-1">
                    {budgetSteps.map(b => <span key={b}>{b}€</span>)}
                  </div>
                  <p className="text-center mt-3 font-syne font-bold text-dark-blue">
                    {prefs.budget}€ /mois cc
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-syne font-bold text-dark-blue mb-2">
                    Taille et profil
                  </h3>
                  <p className="text-sm text-dark-blue font-syne font-bold mb-4">
                    Combien de colocataires ?
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {colocsOptions.map(n => {
                      const active = prefs.nbColocs === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPrefs(p => ({ ...p, nbColocs: n }))}
                          className={`py-2 rounded-full border text-sm font-syne font-bold transition-colors ${
                            active
                              ? 'bg-dark-blue text-white border-dark-blue'
                              : 'border-blue-300 text-dark-blue'
                          }`}
                        >
                          {n === 5 ? '5+' : n}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-dark-blue font-syne font-bold mb-4">Profil souhaité</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {profilOptions.map(p => {
                      const active = prefs.profil === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPrefs(prev => ({ ...prev, profil: p }))}
                          className={`py-2 rounded-full border text-xs font-syne font-medium transition-colors ${
                            active
                              ? 'bg-dark-blue text-white border-dark-blue'
                              : 'border-blue-300 text-dark-blue'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {genreOptions.map(g => {
                      const active = prefs.genre === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setPrefs(prev => ({ ...prev, genre: g }))}
                          className={`py-2 rounded-full border text-xs font-syne font-medium transition-colors ${
                            active
                              ? 'bg-dark-blue text-white border-dark-blue'
                              : 'border-blue-300 text-dark-blue'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-syne font-bold text-dark-blue mb-2">
                    Règles de vie
                  </h3>
                  <p className="text-sm text-dark-blue font-syne font-bold mb-4">
                    Choisissez vos règles
                  </p>
                  <div className="space-y-3">
                    {ruleGroups.map(({ left, right }) => (
                      <div key={left} className="grid grid-cols-2 gap-2">
                        {[left, right].map(opt => {
                          const active = prefs.rules.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setPrefs(p => ({ ...p, rules: toggle(p.rules, opt) }))}
                              className={`py-2 rounded-full border text-xs font-syne font-medium transition-colors ${
                                active
                                  ? 'bg-dark-blue text-white border-dark-blue'
                                  : 'border-blue-300 text-dark-blue'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-300 mt-6 pt-6 flex justify-between items-center gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => ((s - 1) as 1 | 2 | 3))}
                  className="font-syne font-medium text-sm text-dark-blue hover:underline"
                >
                  Retour
                </button>
              ) : (
                <span />
              )}
              <Button
                size="md"
                className="px-8"
                onClick={step < 3 ? next : undefined}
              >
                {step < 3 ? 'Continuer' : 'Terminer'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
