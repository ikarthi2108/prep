import { useState } from 'react';
const empty = {
  "title": "",
  "description": "",
  "status": "Pending",
  "priority": "Medium",
  "dueDate": ""
};
const sample = [{ id: 1, ...{
  "title": "Build the employee API",
  "description": "Implement all five endpoints",
  "status": "Pending",
  "priority": "High",
  "dueDate": "2026-11-01"
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
    const record = { ...form };
    setItems(old => editingId
      ? old.map(item => item.id === editingId ? { ...record, id: editingId } : item)
      : [...old, { ...record, id: Date.now() }]);
    setMessage(editingId ? 'Changes saved.' : 'Task added.');
    reset();
  }
  function edit(item) { setForm(Object.fromEntries(Object.keys(empty).map(key => [key, item[key]]))); setEditingId(item.id); }
  function remove(id) {
    if (!window.confirm('Delete this task?')) return;
    setItems(old => old.filter(item => item.id !== id));
    if (editingId === id) reset();
    setMessage('Task deleted.');
  }
  const filtered = items.filter(item =>
    [item.title].join(' ').toLowerCase().includes(search.toLowerCase())
    && (!filter || item.status === filter)
  ).sort((a, b) => sort === 'price' ? a.price - b.price : a.title.localeCompare(b.title));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <main style={{ maxWidth: 1000, margin: '30px auto', padding: 20, fontFamily: 'system-ui' }}>
    <h1>Task Management</h1>
    <p>Local state demo — changes reset when you reload.</p>
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    <form onSubmit={save} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
      <label>title
        <input name="title" value={form.title} onChange={change} required
          type="text" />
      </label>
      <label>description
        <input name="description" value={form.description} onChange={change} required
          type="text" />
      </label>
      <label>status
        <select name="status" value={form.status} onChange={change}>
          {["Pending","In Progress","Completed"].map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label>priority
        <select name="priority" value={form.priority} onChange={change}>
          {["Low","Medium","High"].map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label>dueDate
        <input name="dueDate" value={form.dueDate} onChange={change} required
          type="date" />
      </label>
      <button type="submit">{editingId ? 'Save changes' : 'Add task'}</button>
      <button type="button" onClick={reset}>Reset form</button>
    </form>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><input aria-label="Search" placeholder="Search tasks…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      <select aria-label="Status" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
        <option value="">All statuses</option>
        {['Pending','In Progress','Completed'].map(value => <option key={value}>{value}</option>)}
      </select>
      <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="name">Alphabetical</option>
      </select></div>
    <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', textAlign: 'left', marginTop: 20 }}>
      <thead><tr><th>title</th><th>description</th><th>status</th><th>priority</th><th>dueDate</th><th>Actions</th></tr></thead>
      <tbody>{visible.map(item => <tr key={item.id}>
        <td>{item.title}</td><td>{item.description}</td><td><span style={{ background: "#edf2ff", borderRadius: 4, padding: 4 }}>{item.status}</span></td><td>{item.priority}</td><td>{item.dueDate}</td>
        <td><button onClick={() => edit(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></td>
      </tr>)}</tbody>
    </table></div>
    {!visible.length && <p>No records found. Add a record or change your search.</p>}
    <div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
      <span> Page {currentPage} of {pages} </span>
      <button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div>
  </main>;
}
