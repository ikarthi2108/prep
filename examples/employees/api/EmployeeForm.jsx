import { useState } from 'react';
const empty = {
  "name": "",
  "email": "",
  "department": "",
  "designation": "",
  "salary": ""
};
export default function EmployeeForm({ item, onSave, onCancel, busy }) {
  const [form, setForm] = useState(item ? Object.fromEntries(Object.keys(empty).map(key => [key, key === 'dueDate' ? item[key].slice(0, 10) : item[key]])) : { ...empty });
  const [error, setError] = useState('');
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (Object.values(form).some(value => String(value).trim() === '')) { setError('Complete all fields'); return; }
    setError('');
    const saved = await onSave({ ...form, salary: Number(form.salary) });
    if (saved) setForm({ ...empty });
  }
  return <form onSubmit={submit}>
    {error && <p role="alert">{error}</p>}
    <fieldset disabled={busy} style={{ display: 'grid', gap: 12 }}>
      <label>name
        <input name="name" value={form.name} onChange={change} required
          type="text" />
      </label>
      <label>email
        <input name="email" value={form.email} onChange={change} required
          type="email" />
      </label>
      <label>department
        <input name="department" value={form.department} onChange={change} required
          type="text" />
      </label>
      <label>designation
        <input name="designation" value={form.designation} onChange={change} required
          type="text" />
      </label>
      <label>salary
        <input name="salary" value={form.salary} onChange={change} required
          type="number" min="0" step="0.01" />
      </label>
      <button type="submit">{busy ? 'Saving…' : item ? 'Save changes' : 'Add employee'}</button>
      <button type="button" onClick={onCancel}>Reset</button>
    </fieldset>
  </form>;
}
