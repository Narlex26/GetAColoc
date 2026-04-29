import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/auth';
import PublicLayout from '../components/layout/PublicLayout';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ mail, password });
      setAuth(res.access_token, res.user);
      navigate(res.user.type === 'proprietaire' ? '/mes-logements' : '/recherche', { replace: true });
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-sm mx-auto px-6 py-12">
        <h1 className="font-syne font-black text-2xl text-dark-blue mb-2">Connexion</h1>
        <p className="text-gray-500 text-sm mb-8">Bon retour parmi nous 👋</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            label="Email"
            type="email"
            value={mail}
            onChange={e => setMail(e.target.value)}
            placeholder="ton@email.com"
            required
          />
          <FormField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore inscrit ?{' '}
          <Link to="/inscription" className="text-dark-blue font-bold underline">S'inscrire</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
