import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/auth";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await authApi.login({ email, password });
      setAuth(res.access_token, res.user);
      navigate("/");
    } catch {
      setErr("Identifiants invalides");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded p-2" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2" type="password" placeholder="Mot de passe"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full bg-black text-white rounded p-2">Se connecter</button>
      </form>
    </div>
  );
}
