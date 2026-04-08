import Badge from '../common/Badge';
import Button from '../common/Button';

export default function CTASection() {
  return (
    <section className="bg-orange-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl text-center space-y-8">
        {/* Badge */}
        <Badge className="justify-center">BÊTA GRATUITE</Badge>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-syne font-black text-dark-blue leading-tight">
          Prêt à trouver ta coloc de rêve?
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-700 font-syne font-semibold max-w-md mx-auto">
          Rejoins des milliers d'utilisateurs qui ont déjà trouvé leur logement via Get A Coloc.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col gap-4 items-center">
          <Button size="lg" variant="outline" className="bg-dark-blue text-white hover:bg-dark-blue hover:bg-opacity-90 w-full sm:w-auto">
            Créer mon compte gratuitement
          </Button>
          <p className="text-xs sm:text-sm text-gray-700 font-syne">
            Aucune carte bancaire requise - 100% gratuit
          </p>
        </div>
      </div>
    </section>
  );
}
