import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import AppLayout from '../layout/AppLayout';

export default function ProtectedRoute() {
  const token = useAuthStore(s => s.token);
  if (!token) return <Navigate to="/connexion" replace />;
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
