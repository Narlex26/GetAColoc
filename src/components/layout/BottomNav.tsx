import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const locataireLinks = [
  { to: '/recherche', label: 'Recherche' },
  { to: '/profils', label: 'Profils' },
  { to: '/groupes', label: 'Groupe' },
  { to: '/messages', label: 'Messages' },
  { to: '/profil', label: 'Profil' },
];

const proprietaireLinks = [
  { to: '/mes-logements', label: 'Logements' },
  { to: '/messages', label: 'Messages' },
  { to: '/profil', label: 'Profil' },
];

export default function BottomNav() {
  const user = useAuthStore(s => s.user);
  const links = user?.type === 'proprietaire' ? proprietaireLinks : locataireLinks;
  const cols = links.length === 3 ? 'grid-cols-3' : 'grid-cols-5';

  return (
    <nav className={`fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white border-t border-black/10 px-4 py-3 grid ${cols} text-center z-50`}>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `font-inter font-semibold text-[10px] ${isActive ? 'text-dark-blue' : 'text-[#606060]'}`
          }
        >
          {({ isActive }) => (
            <span className={isActive ? 'inline-block px-2 py-1 rounded bg-blue-300/50' : ''}>
              {link.label}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
