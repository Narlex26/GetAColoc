import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link to="/" className="font-syne font-black text-dark-blue text-lg">Get A Coloc</Link>
        <div className="flex gap-4 items-center">
          <Link to="/connexion" className="text-sm font-syne text-dark-blue hover:opacity-70">
            Connexion
          </Link>
          <Link
            to="/inscription"
            className="text-sm font-syne bg-orange-400 text-dark-blue px-4 py-2 rounded-full font-bold hover:bg-orange-500 transition-colors"
          >
            S'inscrire
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
