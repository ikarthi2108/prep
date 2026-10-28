import { useNavigate, useOutletContext } from 'react-router-dom';
import { logout } from './authService';
export default function Dashboard() {
  const user = useOutletContext();
  const navigate = useNavigate();
  return <main><h1>Welcome, {user.name}</h1><p>{user.email}</p>
    <button onClick={() => { logout(); navigate('/login', { replace: true }); }}>Log out</button>
  </main>;
}
