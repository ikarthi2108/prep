import { useState } from 'react';
const empty = {
  "name": "",
  "email": "",
  "course": "",
  "marks": ""
};
const sample = [{ id: 1, ...{
  "name": "Jamie Lee",
  "email": "jamie@example.com",
  "course": "Computer Science",
  "marks": 89
} }];

// Paste this entire file into src/App.jsx of a fresh Vite React project.
export default function App() {
  const [items, setItems] = useState(sample);
  const [form, setForm] = useState({ ...empty });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const pageSize = 5;
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  function reset() { setForm({ ...empty }); setEditingId(null); setError(''); }
  function save(event) {
    event.preventDefault();
    if (Object.values(form).some(value => String(value).trim() === '')) {
      setError('Please complete every field.'); return;
    }
    const record = { ...form, marks: Number(form.marks) };
    setItems(old => editingId
      ? old.map(item => item.id === editingId ? { ...record, id: editingId } : item)
      : [...old, { ...record, id: Date.now() }]);
    setMessage(editingId ? 'Changes saved.' : 'Student added.');
    reset();
  }
  function edit(item) { setForm(Object.fromEntries(Object.keys(empty).map(key => [key, item[key]]))); setEditingId(item.id); }
  function remove(id) {
    if (!window.confirm('Delete this student?')) return;
    setItems(old => old.filter(item => item.id !== id));
    if (editingId === id) reset();
    setMessage('Student deleted.');
  }
  const filtered = items.filter(item =>
    [item.name, item.email].join(' ').toLowerCase().includes(search.toLowerCase())
    
  ).sort((a, b) => sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <main style={{ maxWidth: 1000, margin: '30px auto', padding: 20, fontFamily: 'system-ui' }}>
    <h1>Student Management</h1>
    <p>Local state demo — changes reset when you reload.</p>
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    <form onSubmit={save} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
      <label>name
        <input name="name" value={form.name} onChange={change} required
          type="text" />
      </label>
      <label>email
        <input name="email" value={form.email} onChange={change} required
          type="email" />
      </label>
      <label>course
        <input name="course" value={form.course} onChange={change} required
          type="text" />
      </label>
      <label>marks
        <input name="marks" value={form.marks} onChange={change} required
          type="number" min="0" max="100" step="1" />
      </label>
      <button type="submit">{editingId ? 'Save changes' : 'Add student'}</button>
      <button type="button" onClick={reset}>Reset form</button>
    </form>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><input aria-label="Search" placeholder="Search students…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      
      <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="name">Alphabetical</option>
      </select></div>
    <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', textAlign: 'left', marginTop: 20 }}>
      <thead><tr><th>name</th><th>email</th><th>course</th><th>marks</th><th>Actions</th></tr></thead>
      <tbody>{visible.map(item => <tr key={item.id}>
        <td>{item.name}</td><td>{item.email}</td><td>{item.course}</td><td>{item.marks}</td>
        <td><button onClick={() => edit(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></td>
      </tr>)}</tbody>
    </table></div>
    {!visible.length && <p>No records found. Add a record or change your search.</p>}
    <div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
      <span> Page {currentPage} of {pages} </span>
      <button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div>
  </main>;
}
