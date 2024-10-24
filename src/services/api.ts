import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (email: string, password: string, name: string) =>
    api.post('/auth/signup', { email, password, name }),
};

export const transactions = {
  create: (data: any) => api.post('/transactions', data),
  complete: (id: string, location: { lat: number; lng: number }) =>
    api.post(`/transactions/${id}/complete`, { currentLocation: location }),
};

export const wallet = {
  get: () => api.get('/wallets'),
  addFunds: (amount: number, paymentMethodId: string) =>
    api.post('/wallets/add-funds', { amount, paymentMethodId }),
};