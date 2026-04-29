import { Link } from 'react-router-dom';
import Button from '../common/Button';

const stats = [
  { value: '2.4k', label: 'Profils inscrits' },
  { value: '340', label: 'Groupes actifs' },
  { value: '87%', label: 'Taux de match' },
];

export default function HeroSection() {
  return (
    <section className="bg-dark-blue text-white" style={{
      background: 'radial-gradient(ellipse at top left, rgba(255,189,89,.2), transparent 40%), radial-gradient(ellipse at bottom right, rgba(255,189,89,.2), transparent 40%), #273F6D',
    }}>
      <div className="max-w-md mx-auto px-10 py-14">
        <span className="inline-block bg-orange-400 bg-opacity-40 border border-white border-opacity-30 text-orange-400 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          ✨ Bêta gratuite — Rejoins-nous
        </span>

        <h1 className="text-4xl font-syne font-extrabold leading-tight">
          Trouve ta<br />
          <span className="text-orange-400">coloc idéale.</span>
        </h1>

        <p className="mt-6 text-white text-opacity-70 font-syne font-medium text-lg">
          Connecte-toi avec des colocataires compatibles grâce à l'IA, crée ton groupe et postule ensemble à vos logements coup de cœur.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <Link to="/inscription">
            <Button size="lg" className="w-full">
              Créer mon profil gratuitement
            </Button>
          </Link>
          <Link to="/connexion">
            <Button variant="secondary" size="lg" className="w-full">
              Comment ça marche ?
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-md border border-white border-opacity-10 bg-white bg-opacity-10 py-3 text-center"
            >
              <div className="text-orange-400 font-syne font-extrabold text-lg">{stat.value}</div>
              <div className="text-white text-opacity-80 text-xs font-syne font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
