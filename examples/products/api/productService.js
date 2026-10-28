import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const productService = {
  list: params => api.get('/products', { params }).then(res => res.data),
  get: id => api.get('/products/' + id).then(res => res.data),
  create: body => api.post('/products', body).then(res => res.data),
  update: (id, body) => api.put('/products/' + id, body).then(res => res.data),
  remove: id => api.delete('/products/' + id).then(res => res.data)
};
