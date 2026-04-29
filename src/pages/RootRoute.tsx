import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Home from './Home';

export default function RootRoute() {
  const { token, user } = useAuthStore();
  if (!token) return <Home />;
  if (user?.type === 'proprietaire') return <Navigate to="/mes-logements" replace />;
  return <Navigate to="/recherche" replace />;
}
