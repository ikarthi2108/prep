import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getMe, logout } from './authService';
export default function ProtectedRoute() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const expired = () => { if (active) { setUser(null); setLoading(false); } };
    window.addEventListener('auth-expired', expired);
    if (!localStorage.getItem('demo-token')) setLoading(false);
    else getMe().then(data => { if (active) setUser(data); })
      .catch(error => {
        if (!active) return;
        if (error.response?.status === 401) { logout(); setUser(null); }
        else setError('Unable to verify session. Check the API connection.');
      }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; window.removeEventListener('auth-expired', expired); };
  }, [attempt]);
  if (loading) return <p role="status">Checking session…</p>;
  if (error) return <div><p role="alert">{error}</p><button onClick={() => setAttempt(x => x + 1)}>Retry</button></div>;
  return user ? <Outlet context={user} /> : <Navigate to="/login" replace />;
}
