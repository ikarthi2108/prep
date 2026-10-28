import { useEffect, useState } from 'react';
import StudentForm from './StudentForm';
import { studentService as service } from './studentService';
export default function StudentList() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let ignore = false;
    setLoading(true); setError('');
    service.list({ search, page, limit: 5, sort, order: 'asc' })
      .then(data => { if (!ignore) { setItems(data.items); setPages(Math.max(1, data.pages)); if (page > Math.max(1, data.pages)) setPage(Math.max(1, data.pages)); } })
      .catch(error => { if (!ignore) setError(error.response?.data?.message || 'Cannot reach the API. Is the backend running?'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [search, filter, sort, page, version]);
  async function save(body) {
    setBusy(true); setError(''); setMessage('');
    try {
      if (editing) await service.update(editing._id, body); else await service.create(body);
      setEditing(null); setVersion(v => v + 1); setMessage('Saved successfully.'); return true;
    } catch (error) { setError(error.response?.data?.message || 'Save failed'); return false; }
    finally { setBusy(false); }
  }
  async function remove(item) {
    if (!window.confirm('Delete this student?')) return;
    setBusy(true); setError(''); setMessage('');
    try { await service.remove(item._id); if (editing?._id === item._id) setEditing(null); setVersion(v => v + 1); setMessage('Deleted successfully.'); }
    catch (error) { setError(error.response?.data?.message || 'Delete failed'); }
    finally { setBusy(false); }
  }
  return <main style={{ padding: 24, fontFamily: 'system-ui' }}>
    <h1>Student Management</h1>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <StudentForm key={editing?._id || version} item={editing} onSave={save} busy={busy} onCancel={() => { setEditing(null); setVersion(v => v + 1); }} />
    <div style={{ display: 'flex', gap: 12, margin: '20px 0' }}>
      <input aria-label="Search" placeholder="Search students" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      
      <select aria-label="Sort" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}><option value="name">Alphabetical</option></select>
    </div>
    {loading ? <p role="status">Loading…</p> : <div style={{ overflowX: 'auto' }}><table><thead><tr><th>name</th><th>email</th><th>course</th><th>marks</th><th>Actions</th></tr></thead>
      <tbody>{items.map(item => <tr key={item._id}><td>{item.name}</td><td>{item.email}</td><td>{item.course}</td><td>{item.marks}</td><td><button disabled={busy} onClick={() => setEditing(item)}>Edit</button><button disabled={busy} onClick={() => remove(item)}>Delete</button></td></tr>)}</tbody></table>
      {!items.length && !error && <p>No records found.</p>}</div>}
    <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)}>Previous</button> Page {page} of {pages} <button disabled={page >= pages || loading} onClick={() => setPage(page + 1)}>Next</button>
  </main>;
}
