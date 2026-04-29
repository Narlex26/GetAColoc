import { createBrowserRouter } from 'react-router-dom';
import RootRoute from './pages/RootRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Recherche from './pages/Recherche';
import Profils from './pages/Profils';
import Groupes from './pages/Groupes';
import Messages from './pages/Messages';
import Profil from './pages/Profil';
import MesLogements from './pages/MesLogements';
import LogementForm from './pages/LogementForm';
import Candidatures from './pages/Candidatures';
import HomeConnected from './pages/HomeConnected';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <RootRoute /> },
  { path: '/connexion', element: <Login /> },
  { path: '/inscription', element: <Register /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/accueil', element: <HomeConnected /> },
      { path: '/recherche', element: <Recherche /> },
      { path: '/profils', element: <Profils /> },
      { path: '/groupes', element: <Groupes /> },
      { path: '/messages', element: <Messages /> },
      { path: '/profil', element: <Profil /> },
      { path: '/mes-logements', element: <MesLogements /> },
      { path: '/logements/nouveau', element: <LogementForm /> },
      { path: '/logements/:id/modifier', element: <LogementForm /> },
      { path: '/logements/:id/candidatures', element: <Candidatures /> },
    ],
  },
]);
