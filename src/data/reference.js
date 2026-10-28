const item=(title,description,code,file='src/App.jsx',language='jsx')=>({title,description,code,file,language});
export const reactReference=[
item('Functional components & JSX','A component is a function returning JSX. Render this as src/App.jsx: the heading appears on screen.',`export default function App() {
  const topic = 'React';
  return <section><h1>Learn {topic}</h1><p className="intro">One component at a time.</p></section>;
}`),
item('Props','Pass data from a parent to a child. This displays Hello, Alex.',`function Greeting({ name }) { return <h2>Hello, {name}</h2>; }
export default function App() { return <Greeting name="Alex" />; }`),
item('useState','State changes trigger a render. The functional update uses the latest value.',`import { useState } from 'react';
export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(previous => previous + 1)}>Count: {count}</button>;
}`),
item('useEffect','Effects synchronize with something outside React. This updates the browser title after typing.',`import { useEffect, useState } from 'react';
export default function App() {
  const [name, setName] = useState('Alex');
  useEffect(() => { document.title = 'Hello ' + name; }, [name]);
  return <input value={name} onChange={event => setName(event.target.value)} />;
}`),
item('Controlled inputs, onChange, onSubmit & validation','React owns the input value. Native email validation runs before submit; JavaScript rejects whitespace. The form resets on success.',`import { useState } from 'react';
export default function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    if (!email.trim()) { setMessage('Email is required'); return; }
    setMessage('Submitted: ' + email); setEmail('');
  }
  return <form onSubmit={submit}>
    <label>Email <input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
    <button>Submit</button><p role="status">{message}</p>
  </form>;
}`),
item('map & conditional rendering','Use stable IDs as keys. Empty data gets a helpful message instead of a blank table.',`export default function App() {
  const users = [{ id: 1, name: 'Alex' }, { id: 2, name: 'Sam' }];
  return users.length ? <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul> : <p>No users yet.</p>;
}`),
item('filter & find','filter returns an array; find returns the first matching item or undefined.',`const users = [{ id: 1, name: 'Alex' }, { id: 2, name: 'Sam' }];
const matches = users.filter(user => user.name.toLowerCase().includes('a'));
const selected = users.find(user => user.id === 2);
console.log(matches.length); // 2
console.log(selected?.name || 'Not found'); // Sam`,'practice/arrays.js','javascript'),
item('Immutable CRUD state updates','Add, rename, and delete without mutating existing state. Each button changes the list immediately.',`import { useState } from 'react';
export default function App() {
  const [items, setItems] = useState([{ id: 1, name: 'Alex' }]);
  return <div>
    <button onClick={() => setItems(old => [...old, { id: crypto.randomUUID(), name: 'New user' }])}>Add</button>
    {items.map(item => <p key={item.id}>{item.name}
      <button onClick={() => setItems(old => old.map(row => row.id === item.id ? { ...row, name: 'Updated' } : row))}>Rename</button>
      <button onClick={() => setItems(old => old.filter(row => row.id !== item.id))}>Delete</button>
    </p>)}
  </div>;
}`),
item('Fetch, async/await, loading & try/catch','Start the provided backend first. Fetch does not reject HTTP errors automatically, so check response.ok. Cleanup avoids stale state updates.',`import { useEffect, useState } from 'react';
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('http://localhost:5000/api/employees', { signal: controller.signal });
        if (!response.ok) throw new Error('Request failed: ' + response.status);
        const data = await response.json(); setItems(data.items);
      } catch (error) { if (error.name !== 'AbortError') setError(error.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load(); return () => controller.abort();
  }, []);
  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">{error}</p>;
  return items.length ? <ul>{items.map(item => <li key={item._id}>{item.name}</li>)}</ul> : <p>No employees yet.</p>;
}`),
item('Axios','Install axios. Unlike fetch, Axios rejects non-2xx responses by default and parses JSON for you. Run this service from a Vite app.',`import axios from 'axios';
export async function loadEmployees() {
  try {
    const { data } = await axios.get('http://localhost:5000/api/employees');
    return data.items;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error');
  }
}`,'src/employeeService.js','javascript'),
item('React Router','Install react-router-dom. Link navigates without reloading; Routes selects the page for the current URL.',`import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
export default function App() {
  return <BrowserRouter>
    <nav><Link to="/">Home</Link> <Link to="/employees">Employees</Link></nav>
    <Routes><Route path="/" element={<h1>Home</h1>} />
      <Route path="/employees" element={<h1>Employees</h1>} />
      <Route path="*" element={<h1>Page not found</h1>} /></Routes>
  </BrowserRouter>;
}`),
item('Functions as props & parent-child communication','The child reports an action through a callback. The parent owns and updates the shared state.',`import { useState } from 'react';
function AddButton({ onAdd }) { return <button onClick={onAdd}>Add one</button>; }
export default function App() {
  const [total, setTotal] = useState(0);
  return <div><p>{total}</p><AddButton onAdd={() => setTotal(value => value + 1)} /></div>;
}`)
];
export const searchExample=`import { useState } from 'react';
const records = [
  { id: 1, name: 'Keyboard', email: 'alex@example.com', category: 'Tech', status: 'Pending', price: 80 },
  { id: 2, name: 'Notebook', email: 'sam@example.com', category: 'Office', status: 'Completed', price: 5 },
  { id: 3, name: 'Mouse', email: 'lee@example.com', category: 'Tech', status: 'In Progress', price: 25 }
];
export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const pageSize = 2;
  const filtered = records.filter(item =>
    (item.name + ' ' + item.email).toLowerCase().includes(query.toLowerCase()) &&
    (!category || item.category === category) && (!status || item.status === status)
  ).sort((a, b) => sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);
  return <div>
    <input placeholder="Search name or email" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
    <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
      <option value="">All categories</option><option>Tech</option><option>Office</option>
    </select>
    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
      <option value="">All statuses</option><option>Pending</option><option>In Progress</option><option>Completed</option>
    </select>
    <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
      <option value="name">Name A–Z</option><option value="price">Price ascending</option>
    </select>
    {visible.map(item => <p key={item.id}>{item.name} — {item.price}</p>)}
    {!visible.length && <p>No results.</p>}
    <button disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
    <span> {current} / {pages} </span>
    <button disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
  </div>;
}`;
export const mongoOperations=`import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Employee from './models/Employee.js';

await connectDB();
try {
  const employee = await Employee.create({ name: 'Practice user',
    email: 'practice-' + Date.now() + '@example.com', department: 'Engineering',
    designation: 'Developer', salary: 50000 });
  console.log(await Employee.find({ department: 'Engineering' }));
  console.log(await Employee.findById(employee._id));
  console.log(await Employee.findByIdAndUpdate(employee._id,
    { $set: { salary: 55000 } }, { new: true, runValidators: true }));
  employee.designation = 'Senior developer';
  await employee.save();
  const page = 1, limit = 5;
  console.log(await Employee.find({ name: { $regex: 'practice', $options: 'i' } })
    .sort({ name: 1, _id: 1 }).skip((page - 1) * limit).limit(limit));
  if (!mongoose.isObjectIdOrHexString('invalid-id')) console.log('Reject with HTTP 400');
  await Employee.findByIdAndDelete(employee._id);
} catch (error) {
  if (error.code === 11000) console.error('Duplicate email');
  else console.error(error.message);
} finally { await mongoose.disconnect(); }
`;
export const debugging=[
['MongoDB connection failure','MongoDB is stopped, the URI is wrong, or Atlas denies your IP.','Start your local MongoDB service or use the Atlas connection URI. Check database credentials and Atlas network access.','MONGO_URI=mongodb://127.0.0.1:27017/mern_machine_test'],
['Port already in use','Another process is listening on the configured port.','Stop the old server or change PORT; update VITE_API_URL to match.','PORT=5001'],
['CORS errors','The browser origin differs from the allowed frontend origin.','Use the exact frontend origin, including protocol and port. Restart the backend after changing .env.','CLIENT_ORIGIN=http://localhost:5173'],
['req.body is undefined','JSON middleware is missing or the request has the wrong content type.','Register express.json() before routes. In Postman choose Body → raw → JSON.','app.use(express.json());'],
['Invalid ObjectId','The URL contains a malformed database ID.','Validate before querying; use an ID returned by a create or list request.',"mongoose.isObjectIdOrHexString(req.params.id)"],
['Missing React list keys','Rendered siblings have no stable identifier.','Use the database ID or a persistent local ID. Avoid random keys and indexes for editable lists.','items.map(item => <li key={item._id}>{item.name}</li>)'],
['Controlled input warning','An input changes from undefined to a defined value.','Initialize input state with empty strings and give optional values a fallback.',"const [name, setName] = useState('');"],
['Axios request failure','The backend is down, the path is wrong, or validation failed.','Inspect the browser Network tab. Read error.response for server errors; no response usually indicates a connection problem.',"error.response?.data?.message || 'Cannot reach API'"],
['State appears stale','React batches updates, or an existing state object was mutated.','Use functional updates when deriving a value from its previous state. Render to observe the new value.','setCount(previous => previous + 1);'],
['JWT verification failure','The token expired, was changed, or was signed with another secret.','Use the same JWT_SECRET for signing and verification. Send Bearer followed by one space and the token. Log in again after expiry.',"config.headers.Authorization = 'Bearer ' + token;"],
['Missing environment variables','The .env file is absent, misnamed, or loaded too late.','Copy .env.example to .env. Load dotenv in the server entry. Only prefix public browser settings with VITE_.',"import 'dotenv/config';"],
['Module import/export error','A named import was used for a default export, or an ESM path lacks its extension.','Match the export style. Node ESM local imports need .js extensions.',"import Employee from '../models/Employee.js';"],
['API route not found','The HTTP method, resource name, or /api prefix differs.','Compare the complete URL with the router mount path and method in the API reference.','GET http://localhost:5000/api/employees'],
['Cannot read properties of undefined','Data has not loaded or a property name differs.','Initialize arrays as [] and show loading states. Use optional chaining for genuinely optional properties.',"const name = user?.name || 'Guest';"],
['Password comparison fails','A password was hashed twice or arguments to compare were reversed.','Hash once on registration. Select the stored hash and compare plaintext first; never compare two freshly generated hashes.','await bcrypt.compare(password, user.password);']
].map(([title,cause,fix,code])=>({title,cause,fix,code}));
