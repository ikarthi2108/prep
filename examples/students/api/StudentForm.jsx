import { useState } from 'react';
const empty = {
  "name": "",
  "email": "",
  "course": "",
  "marks": ""
};
export default function StudentForm({ item, onSave, onCancel, busy }) {
  const [form, setForm] = useState(item ? Object.fromEntries(Object.keys(empty).map(key => [key, key === 'dueDate' ? item[key].slice(0, 10) : item[key]])) : { ...empty });
  const [error, setError] = useState('');
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (Object.values(form).some(value => String(value).trim() === '')) { setError('Complete all fields'); return; }
    setError('');
    const saved = await onSave({ ...form, marks: Number(form.marks) });
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
      <label>course
        <input name="course" value={form.course} onChange={change} required
          type="text" />
      </label>
      <label>marks
        <input name="marks" value={form.marks} onChange={change} required
          type="number" min="0" max="100" step="1" />
      </label>
      <button type="submit">{busy ? 'Saving…' : item ? 'Save changes' : 'Add student'}</button>
      <button type="button" onClick={onCancel}>Reset</button>
    </fieldset>
  </form>;
}
