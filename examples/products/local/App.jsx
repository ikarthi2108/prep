import { useState } from 'react';
const empty = {
  "name": "",
  "description": "",
  "price": "",
  "category": "",
  "stock": ""
};
const sample = [{ id: 1, ...{
  "name": "Wireless keyboard",
  "description": "Compact mechanical keyboard",
  "price": 79,
  "category": "Electronics",
  "stock": 24
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
    const record = { ...form, price: Number(form.price), stock: Number(form.stock) };
    setItems(old => editingId
      ? old.map(item => item.id === editingId ? { ...record, id: editingId } : item)
      : [...old, { ...record, id: Date.now() }]);
    setMessage(editingId ? 'Changes saved.' : 'Product added.');
    reset();
  }
  function edit(item) { setForm(Object.fromEntries(Object.keys(empty).map(key => [key, item[key]]))); setEditingId(item.id); }
  function remove(id) {
    if (!window.confirm('Delete this product?')) return;
    setItems(old => old.filter(item => item.id !== id));
    if (editingId === id) reset();
    setMessage('Product deleted.');
  }
  const filtered = items.filter(item =>
    [item.name].join(' ').toLowerCase().includes(search.toLowerCase())
    && (!filter || item.category === filter)
  ).sort((a, b) => sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <main style={{ maxWidth: 1000, margin: '30px auto', padding: 20, fontFamily: 'system-ui' }}>
    <h1>Product Management</h1>
    <p>Local state demo — changes reset when you reload.</p>
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    <form onSubmit={save} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
      <label>name
        <input name="name" value={form.name} onChange={change} required
          type="text" />
      </label>
      <label>description
        <input name="description" value={form.description} onChange={change} required
          type="text" />
      </label>
      <label>price
        <input name="price" value={form.price} onChange={change} required
          type="number" min="0" step="0.01" />
      </label>
      <label>category
        <input name="category" value={form.category} onChange={change} required
          type="text" />
      </label>
      <label>stock
        <input name="stock" value={form.stock} onChange={change} required
          type="number" min="0" step="1" />
      </label>
      <button type="submit">{editingId ? 'Save changes' : 'Add product'}</button>
      <button type="button" onClick={reset}>Reset form</button>
    </form>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><input aria-label="Search" placeholder="Search products…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      <select aria-label="Category" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
        <option value="">All categories</option>
        {[...new Set(items.map(item => item.category))].map(value => <option key={value}>{value}</option>)}
      </select>
      <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="name">Alphabetical</option><option value="price">Price: low to high</option>
      </select></div>
    <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', textAlign: 'left', marginTop: 20 }}>
      <thead><tr><th>name</th><th>description</th><th>price</th><th>category</th><th>stock</th><th>Actions</th></tr></thead>
      <tbody>{visible.map(item => <tr key={item.id}>
        <td>{item.name}</td><td>{item.description}</td><td>{item.price}</td><td>{item.category}</td><td>{item.stock}</td>
        <td><button onClick={() => edit(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></td>
      </tr>)}</tbody>
    </table></div>
    {!visible.length && <p>No records found. Add a record or change your search.</p>}
    <div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
      <span> Page {currentPage} of {pages} </span>
      <button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div>
  </main>;
}
