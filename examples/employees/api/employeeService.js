import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const employeeService = {
  list: params => api.get('/employees', { params }).then(res => res.data),
  get: id => api.get('/employees/' + id).then(res => res.data),
  create: body => api.post('/employees', body).then(res => res.data),
  update: (id, body) => api.put('/employees/' + id, body).then(res => res.data),
  remove: id => api.delete('/employees/' + id).then(res => res.data)
};
