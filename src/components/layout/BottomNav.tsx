import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const locataireLinks = [
  { to: '/recherche', label: 'Recherche', icon: '🔍' },
  { to: '/profils', label: 'Profils', icon: '👥' },
  { to: '/groupes', label: 'Groupe', icon: '🏠' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/profil', label: 'Profil', icon: '👤' },
];

const proprietaireLinks = [
  { to: '/mes-logements', label: 'Logements', icon: '🏘️' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/profil', label: 'Profil', icon: '👤' },
];

export default function BottomNav() {
  const user = useAuthStore(s => s.user);
  const links = user?.type === 'proprietaire' ? proprietaireLinks : locataireLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs px-2 py-1 ${
              isActive ? 'text-dark-blue font-bold' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
