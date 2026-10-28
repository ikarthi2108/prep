import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const taskService = {
  list: params => api.get('/tasks', { params }).then(res => res.data),
  get: id => api.get('/tasks/' + id).then(res => res.data),
  create: body => api.post('/tasks', body).then(res => res.data),
  update: (id, body) => api.put('/tasks/' + id, body).then(res => res.data),
  remove: id => api.delete('/tasks/' + id).then(res => res.data)
};
