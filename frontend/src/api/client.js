import axios from 'axios';

const api = axios.create({
  baseURL: '/v1', // Proxied to localhost:8000 in Vite config during dev
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper for form-urlencoded requests (like OAuth2 login)
export const loginRequest = (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return api.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

export default api;
