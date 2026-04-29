import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-md mx-auto flex items-center justify-between px-5 py-2.5">
        <img src={logo} alt="Get A Coloc" className="w-10 h-10 rounded-lg" />
        <nav className="flex items-center gap-4">
          <Link to="/connexion" className="font-inter text-xs text-dark-blue">
            Connexion
          </Link>
          <Link
            to="/inscription"
            className="bg-dark-blue text-white text-xs font-inter px-4 py-1.5 rounded-full"
          >
            S'inscrire
          </Link>
        </nav>
      </div>
    </header>
  );
}
