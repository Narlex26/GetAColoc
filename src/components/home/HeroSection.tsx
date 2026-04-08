import Button from '../common/Button';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-dark-blue to-dark-blue pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md mx-auto lg:max-w-2xl">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <div className="flex items-center gap-2">
            <img
              src="/favicon.svg"
              alt="Get A Coloc"
              className="w-10 h-10 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="text-white text-sm sm:text-base font-syne">
              Connexion
            </button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5">
              S'inscrire
            </Button>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="space-y-8 sm:space-y-12">
          {/* Badge */}
          <div className="inline-block px-4 py-2 rounded-3xl border border-white border-opacity-30 bg-orange-400 bg-opacity-40 text-orange-400 text-xs sm:text-sm font-syne font-medium">
            ✨ Bêta gratuite — Rejoins-nous
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-syne font-black leading-tight">
            <span className="text-white">Trouve ta</span>
            <br />
            <span className="text-orange-400">coloc idéale.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-white text-opacity-70 font-syne font-medium max-w-lg">
            Connecte-toi avec des colocataires compatibles grâce à l'IA, crée ton groupe et postule ensemble à vos logements coup de cœur.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:gap-3 max-w-lg pt-4">
            <Button size="lg" className="w-full sm:w-auto">
              Créer mon profil gratuitement
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Comment ça marche ?
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
