import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from './authService';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(form); navigate('/dashboard', { replace: true }); }
    catch (error) { setError(error.response?.data?.message || 'Cannot reach the API'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}>
    <h1>Log in</h1>{error && <p role="alert">{error}</p>}
    <label>Email <input type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
    <label>Password <input type="password" autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
    <button disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
    <Link to="/register">Create account</Link>
  </form>;
}
