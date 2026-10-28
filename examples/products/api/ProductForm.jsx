import { useState } from 'react';
const empty = {
  "name": "",
  "description": "",
  "price": "",
  "category": "",
  "stock": ""
};
export default function ProductForm({ item, onSave, onCancel, busy }) {
  const [form, setForm] = useState(item ? Object.fromEntries(Object.keys(empty).map(key => [key, key === 'dueDate' ? item[key].slice(0, 10) : item[key]])) : { ...empty });
  const [error, setError] = useState('');
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (Object.values(form).some(value => String(value).trim() === '')) { setError('Complete all fields'); return; }
    setError('');
    const saved = await onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
    if (saved) setForm({ ...empty });
  }
  return <form onSubmit={submit}>
    {error && <p role="alert">{error}</p>}
    <fieldset disabled={busy} style={{ display: 'grid', gap: 12 }}>
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
      <button type="submit">{busy ? 'Saving…' : item ? 'Save changes' : 'Add product'}</button>
      <button type="button" onClick={onCancel}>Reset</button>
    </fieldset>
  </form>;
}
