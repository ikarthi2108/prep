import fs from 'node:fs';
import path from 'node:path';
const write=(file,code)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,code.trim()+'\n')};
const definitions=[
 {key:'employees',name:'Employee',fields:['name','email','department','designation','salary'],numbers:['salary'],sample:{name:'Alex Morgan',email:'alex@example.com',department:'Engineering',designation:'Developer',salary:65000}},
 {key:'products',name:'Product',fields:['name','description','price','category','stock'],numbers:['price','stock'],sample:{name:'Wireless keyboard',description:'Compact mechanical keyboard',price:79,category:'Electronics',stock:24}},
 {key:'students',name:'Student',fields:['name','email','course','marks'],numbers:['marks'],sample:{name:'Jamie Lee',email:'jamie@example.com',course:'Computer Science',marks:89}},
 {key:'tasks',name:'Task',fields:['title','description','status','priority','dueDate'],numbers:[],sample:{title:'Build the employee API',description:'Implement all five endpoints',status:'Pending',priority:'High',dueDate:'2026-11-01'}}
];
write('backend/package.json',JSON.stringify({name:'mern-guide-backend',version:'1.0.0',private:true,type:'module',scripts:{dev:'node --watch server.js',start:'node server.js',test:'node --test'},dependencies:{express:'^5.1.0',mongoose:'^8.19.0',cors:'^2.8.5',dotenv:'^16.6.1',bcryptjs:'^3.0.2',jsonwebtoken:'^9.0.2'}},null,2));
write('backend/.env.example',`PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_machine_test
JWT_SECRET=
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173`);
write('backend/config/db.js',`import mongoose from 'mongoose';
export default async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in .env');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
}`);
write('backend/middleware/errorMiddleware.js',`export default function errorMiddleware(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 11000) return res.status(409).json({ message: 'Email already exists' });
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON' });
  console.error(error.message);
  res.status(500).json({ message: 'Something went wrong on the server' });
}`);
for(const d of definitions){
 const lower=d.name.toLowerCase();
 const schema=d.fields.map(f=>`  ${f}: ${d.numbers.includes(f)?`{ type: Number, required: true, min: 0${f==='marks'?', max: 100':''}${f==='stock'?', validate: { validator: Number.isInteger, message: "Stock must be an integer" }':''} }`:f==='email'?`{ type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ }`:f==='status'?`{ type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending', required: true }`:f==='priority'?`{ type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', required: true }`:f==='dueDate'?`{ type: Date, required: true }`:`{ type: String, required: true, trim: true, maxlength: 500 }`}`).join(',\n');
 write(`backend/models/${d.name}.js`,`import mongoose from 'mongoose';
const schema = new mongoose.Schema({
${schema}
}, { timestamps: true });
export default mongoose.model('${d.name}', schema);`);
 write(`backend/controllers/${lower}Controller.js`,`import ${d.name} from '../models/${d.name}.js';

// Only accept known fields. Never pass an unfiltered request body to MongoDB.
const fields = ${JSON.stringify(d.fields)};
function cleanBody(body) {
  const result = {};
  for (const field of fields) {
    const value = body?.[field];
    if (value === undefined || value === null || String(value).trim() === '') {
      const error = new Error(field + ' is required');
      error.name = 'ValidationError';
      throw error;
    }
    if (typeof value === 'object' || typeof value === 'boolean') {
      const error = new Error(field + ' must be a simple value');
      error.name = 'ValidationError';
      throw error;
    }
    result[field] = value;
  }
  return result;
}

export async function getAll(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const query = {};
    // Escape regex metacharacters so searching treats user text literally.
    const escaped = Array.from(String(req.query.search || '')).map(char => ('^$.*+?()[]{}|' + String.fromCharCode(92)).includes(char) ? String.fromCharCode(92) + char : char).join('');
    if (escaped) query.$or = [${d.fields.includes('email')?`{ name: { $regex: escaped, $options: 'i' } }, { email: { $regex: escaped, $options: 'i' } }`:`{ ${d.key==='tasks'?'title':'name'}: { $regex: escaped, $options: 'i' } }`}];
    ${d.key==='products'?`if (req.query.category) query.category = String(req.query.category);`:d.key==='tasks'?`if (req.query.status) query.status = String(req.query.status);`:''}
    const allowedSort = ['createdAt', ${d.key==='tasks'?"'title'":"'name'"}${d.key==='products'?", 'price'":''}];
    const sortBy = allowedSort.includes(req.query.sort) ? req.query.sort : 'createdAt';
    const direction = req.query.order === 'asc' ? 1 : -1;
    const [items, total] = await Promise.all([
      ${d.name}.find(query).sort({ [sortBy]: direction, _id: 1 }).skip((page - 1) * limit).limit(limit),
      ${d.name}.countDocuments(query)
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
}

export async function getOne(req, res, next) {
  try {
    const item = await ${d.name}.findById(req.params.id);
    if (!item) return res.status(404).json({ message: '${d.name} not found' });
    res.json(item);
  } catch (error) { next(error); }
}

export async function create(req, res, next) {
  try {
    const item = await ${d.name}.create(cleanBody(req.body));
    res.status(201).json(item);
  } catch (error) { next(error); }
}

export async function update(req, res, next) {
  try {
    const item = await ${d.name}.findByIdAndUpdate(req.params.id,
      { $set: cleanBody(req.body) }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: '${d.name} not found' });
    res.json(item);
  } catch (error) { next(error); }
}

export async function remove(req, res, next) {
  try {
    const item = await ${d.name}.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: '${d.name} not found' });
    res.json({ message: '${d.name} deleted' });
  } catch (error) { next(error); }
}`);
 write(`backend/routes/${lower}Routes.js`,`import { Router } from 'express';
import mongoose from 'mongoose';
import { getAll, getOne, create, update, remove } from '../controllers/${lower}Controller.js';
const router = Router();
router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ message: 'Invalid ObjectId' });
  next();
});
router.route('/').get(getAll).post(create);
router.route('/:id').get(getOne).put(update).delete(remove);
export default router;`);
 const initial=Object.fromEntries(d.fields.map(f=>[f,f==='status'?'Pending':f==='priority'?'Medium':'']));
 const formInputs=d.fields.map(f=>`      <label>${f}\n${['status','priority'].includes(f)?`        <select name="${f}" value={form.${f}} onChange={change}>
          {${JSON.stringify(f==='status'?['Pending','In Progress','Completed']:['Low','Medium','High'])}.map(value => <option key={value}>{value}</option>)}
        </select>`:`        <input name="${f}" value={form.${f}} onChange={change} required
          type="${f==='email'?'email':f==='dueDate'?'date':d.numbers.includes(f)?'number':'text'}"${d.numbers.includes(f)?` min="0"${f==='marks'?' max="100"':''} step="${['price','salary'].includes(f)?'0.01':'1'}"`:''} />`}
      </label>`).join('\n');
 const controls=`<input aria-label="Search" placeholder="Search ${d.key}…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      ${d.key==='products'?`<select aria-label="Category" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
        <option value="">All categories</option>
        {[...new Set(items.map(item => item.category))].map(value => <option key={value}>{value}</option>)}
      </select>`:d.key==='tasks'?`<select aria-label="Status" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
        <option value="">All statuses</option>
        {['Pending','In Progress','Completed'].map(value => <option key={value}>{value}</option>)}
      </select>`:''}
      <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="name">Alphabetical</option>${d.key==='products'?'<option value="price">Price: low to high</option>':''}
      </select>`;
 const local=`import { useState } from 'react';
const empty = ${JSON.stringify(initial,null,2)};
const sample = [{ id: 1, ...${JSON.stringify(d.sample,null,2)} }];

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
    const record = { ...form${d.numbers.map(f=>`, ${f}: Number(form.${f})`).join('')} };
    setItems(old => editingId
      ? old.map(item => item.id === editingId ? { ...record, id: editingId } : item)
      : [...old, { ...record, id: Date.now() }]);
    setMessage(editingId ? 'Changes saved.' : '${d.name} added.');
    reset();
  }
  function edit(item) { setForm(Object.fromEntries(Object.keys(empty).map(key => [key, item[key]]))); setEditingId(item.id); }
  function remove(id) {
    if (!window.confirm('Delete this ${lower}?')) return;
    setItems(old => old.filter(item => item.id !== id));
    if (editingId === id) reset();
    setMessage('${d.name} deleted.');
  }
  const filtered = items.filter(item =>
    [item.${d.key==='tasks'?'title':'name'}${d.fields.includes('email')?', item.email':''}].join(' ').toLowerCase().includes(search.toLowerCase())
    ${d.key==='products'?`&& (!filter || item.category === filter)`:d.key==='tasks'?`&& (!filter || item.status === filter)`:''}
  ).sort((a, b) => sort === 'price' ? a.price - b.price : a.${d.key==='tasks'?'title':'name'}.localeCompare(b.${d.key==='tasks'?'title':'name'}));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <main style={{ maxWidth: 1000, margin: '30px auto', padding: 20, fontFamily: 'system-ui' }}>
    <h1>${d.name} Management</h1>
    <p>Local state demo — changes reset when you reload.</p>
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    <form onSubmit={save} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
${formInputs}
      <button type="submit">{editingId ? 'Save changes' : 'Add ${lower}'}</button>
      <button type="button" onClick={reset}>Reset form</button>
    </form>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>${controls}</div>
    <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', textAlign: 'left', marginTop: 20 }}>
      <thead><tr>${d.fields.map(f=>`<th>${f}</th>`).join('')}<th>Actions</th></tr></thead>
      <tbody>{visible.map(item => <tr key={item.id}>
        ${d.fields.map(f=>`<td>${f==='status'?'<span style={{ background: "#edf2ff", borderRadius: 4, padding: 4 }}>{item.status}</span>':`{item.${f}}`}</td>`).join('')}
        <td><button onClick={() => edit(item)}>Edit</button><button onClick={() => remove(item.id)}>Delete</button></td>
      </tr>)}</tbody>
    </table></div>
    {!visible.length && <p>No records found. Add a record or change your search.</p>}
    <div><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button>
      <span> Page {currentPage} of {pages} </span>
      <button disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div>
  </main>;
}`;
 write(`examples/${d.key}/local/App.jsx`,local);
 write(`examples/${d.key}/api/${lower}Service.js`,`import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const ${lower}Service = {
  list: params => api.get('/${d.key}', { params }).then(res => res.data),
  get: id => api.get('/${d.key}/' + id).then(res => res.data),
  create: body => api.post('/${d.key}', body).then(res => res.data),
  update: (id, body) => api.put('/${d.key}/' + id, body).then(res => res.data),
  remove: id => api.delete('/${d.key}/' + id).then(res => res.data)
};`);
 write(`examples/${d.key}/api/${d.name}Form.jsx`,`import { useState } from 'react';
const empty = ${JSON.stringify(initial,null,2)};
export default function ${d.name}Form({ item, onSave, onCancel, busy }) {
  const [form, setForm] = useState(item ? Object.fromEntries(Object.keys(empty).map(key => [key, key === 'dueDate' ? item[key].slice(0, 10) : item[key]])) : { ...empty });
  const [error, setError] = useState('');
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault();
    if (Object.values(form).some(value => String(value).trim() === '')) { setError('Complete all fields'); return; }
    setError('');
    const saved = await onSave({ ...form${d.numbers.map(f=>`, ${f}: Number(form.${f})`).join('')} });
    if (saved) setForm({ ...empty });
  }
  return <form onSubmit={submit}>
    {error && <p role="alert">{error}</p>}
    <fieldset disabled={busy} style={{ display: 'grid', gap: 12 }}>
${formInputs}
      <button type="submit">{busy ? 'Saving…' : item ? 'Save changes' : 'Add ${lower}'}</button>
      <button type="button" onClick={onCancel}>Reset</button>
    </fieldset>
  </form>;
}`);
 write(`examples/${d.key}/api/${d.name}List.jsx`,`import { useEffect, useState } from 'react';
import ${d.name}Form from './${d.name}Form';
import { ${lower}Service as service } from './${lower}Service';
export default function ${d.name}List() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('${d.key==='tasks'?'title':'name'}');
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
    service.list({ search, page, limit: 5, sort, order: 'asc'${d.key==='products'?', category: filter':d.key==='tasks'?', status: filter':''} })
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
    if (!window.confirm('Delete this ${lower}?')) return;
    setBusy(true); setError(''); setMessage('');
    try { await service.remove(item._id); if (editing?._id === item._id) setEditing(null); setVersion(v => v + 1); setMessage('Deleted successfully.'); }
    catch (error) { setError(error.response?.data?.message || 'Delete failed'); }
    finally { setBusy(false); }
  }
  return <main style={{ padding: 24, fontFamily: 'system-ui' }}>
    <h1>${d.name} Management</h1>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    <${d.name}Form key={editing?._id || version} item={editing} onSave={save} busy={busy} onCancel={() => { setEditing(null); setVersion(v => v + 1); }} />
    <div style={{ display: 'flex', gap: 12, margin: '20px 0' }}>
      <input aria-label="Search" placeholder="Search ${d.key}" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      ${d.key==='products'?`<input aria-label="Category" placeholder="Exact category (blank = all)" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} />`:d.key==='tasks'?`<select aria-label="Status" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}><option value="">All statuses</option>{['Pending','In Progress','Completed'].map(value => <option key={value}>{value}</option>)}</select>`:''}
      <select aria-label="Sort" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}><option value="${d.key==='tasks'?'title':'name'}">Alphabetical</option>${d.key==='products'?'<option value="price">Price: low to high</option>':''}</select>
    </div>
    {loading ? <p role="status">Loading…</p> : <div style={{ overflowX: 'auto' }}><table><thead><tr>${d.fields.map(f=>`<th>${f}</th>`).join('')}<th>Actions</th></tr></thead>
      <tbody>{items.map(item => <tr key={item._id}>${d.fields.map(f=>`<td>${f==='status'?'<span style={{ background: "#edf2ff", padding: 4 }}>{item.status}</span>':`{item.${f}${f==='dueDate'?'?.slice(0, 10)':''}}`}</td>`).join('')}<td><button disabled={busy} onClick={() => setEditing(item)}>Edit</button><button disabled={busy} onClick={() => remove(item)}>Delete</button></td></tr>)}</tbody></table>
      {!items.length && !error && <p>No records found.</p>}</div>}
    <button disabled={page === 1 || loading} onClick={() => setPage(page - 1)}>Previous</button> Page {page} of {pages} <button disabled={page >= pages || loading} onClick={() => setPage(page + 1)}>Next</button>
  </main>;
}`);
 write(`examples/${d.key}/api/App.jsx`,`import ${d.name}List from './${d.name}List';
export default function App() { return <${d.name}List />; }`);
}
write('src/data/resources.json',JSON.stringify(definitions,null,2));
console.log('Generated four complete CRUD examples and backend resource modules.');

