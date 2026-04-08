interface FooterLink {
  label: string;
  href: string;
}

const aboutLinks: FooterLink[] = [
  { label: 'À propos', href: '#about' },
  { label: 'Pour les propriétaires', href: '#landlords' },
  { label: 'Aides & FAQ', href: '#faq' },
  { label: 'Mentions légales', href: '#legal' },
];

const resourceLinks: FooterLink[] = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
  { label: 'Confidentialité', href: '#privacy' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-blue text-blue-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl space-y-8">
        {/* Logo & Description */}
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-syne font-black">
            <span className="text-white">Get A Coloc</span>
            <span className="text-orange-400">.</span>
          </h3>
          <p className="text-xs sm:text-sm font-syne font-normal leading-relaxed max-w-sm">
            La plateforme qui simplifie la recherche de colocation grâce à l'intelligence artificielle et aux connections humaines.
          </p>
        </div>

        {/* Links Sections */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-12">
          {/* Left Column */}
          <div className="space-y-3">
            {aboutLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs sm:text-sm font-syne hover:text-white transition-colors block"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {resourceLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs sm:text-sm font-syne hover:text-white transition-colors block"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-400 border-opacity-50"></div>

        {/* Copyright */}
        <p className="text-xs sm:text-sm font-syne text-blue-500">
          2025 Get A Coloc. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
