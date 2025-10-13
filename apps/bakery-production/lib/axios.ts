import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/organizations`,
  withCredentials: true,
});

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('auth-token'); // Or get from your auth provider
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
export default api;
