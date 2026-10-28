import { useState } from 'react';
const empty = {
  "title": "",
  "description": "",
  "status": "Pending",
  "priority": "Medium",
  "dueDate": ""
};
export default function TaskForm({ item, onSave, onCancel, busy }) {
  const [form, setForm] = useState(item ? Object.fromEntries(Object.keys(empty).map(key => [key, key === 'dueDate' ? item[key].slice(0, 10) : item[key]])) : { ...empty });
  const [error, setError] = useState('');
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (Object.values(form).some(value => String(value).trim() === '')) { setError('Complete all fields'); return; }
    setError('');
    const saved = await onSave({ ...form });
    if (saved) setForm({ ...empty });
  }
  return <form onSubmit={submit}>
    {error && <p role="alert">{error}</p>}
    <fieldset disabled={busy} style={{ display: 'grid', gap: 12 }}>
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
      <button type="submit">{busy ? 'Saving…' : item ? 'Save changes' : 'Add task'}</button>
      <button type="button" onClick={onCancel}>Reset</button>
    </fieldset>
  </form>;
}
