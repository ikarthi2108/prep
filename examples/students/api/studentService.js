import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const studentService = {
  list: params => api.get('/students', { params }).then(res => res.data),
  get: id => api.get('/students/' + id).then(res => res.data),
  create: body => api.post('/students', body).then(res => res.data),
  update: (id, body) => api.put('/students/' + id, body).then(res => res.data),
  remove: id => api.delete('/students/' + id).then(res => res.data)
};
