import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from './authService';
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(event) {
    event.preventDefault(); setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (new TextEncoder().encode(form.password).length > 72) { setError('Password must be at most 72 bytes'); return; }
    setBusy(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (error) { setError(error.response?.data?.message || 'Cannot reach the API'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}>
    <h1>Create account</h1>{error && <p role="alert">{error}</p>}
    <label>Name <input name="name" required value={form.name} onChange={change} autoComplete="name" /></label>
    <label>Email <input name="email" type="email" required value={form.email} onChange={change} autoComplete="email" /></label>
    <label>Password <input name="password" type="password" minLength={8} required value={form.password} onChange={change} autoComplete="new-password" /></label>
    <label>Confirm password <input name="confirm" type="password" minLength={8} required value={form.confirm} onChange={change} autoComplete="new-password" /></label>
    <button disabled={busy}>{busy ? 'Creating…' : 'Register'}</button><Link to="/login">Log in</Link>
  </form>;
}
