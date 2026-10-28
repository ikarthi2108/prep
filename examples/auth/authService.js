import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
// Learning demo: localStorage is readable by JavaScript and vulnerable to token theft via XSS.
// Production alternatives include secure HttpOnly cookies with CSRF protection.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('demo-token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('demo-token');
    window.dispatchEvent(new Event('auth-expired'));
  }
  return Promise.reject(error);
});
export async function login(body) {
  const { data } = await api.post('/auth/login', body);
  localStorage.setItem('demo-token', data.token);
  return data.user;
}
export async function register(body) {
  const { data } = await api.post('/auth/register', body);
  localStorage.setItem('demo-token', data.token);
  return data.user;
}
export const getMe = () => api.get('/auth/me').then(response => response.data);
export const logout = () => localStorage.removeItem('demo-token');
