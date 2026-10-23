import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartspend_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('smartspend_token');
      localStorage.removeItem('smartspend_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const transactionService = {
  getAll: async (params = {}) => {
    const res = await api.get('/transactions', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/transactions', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/transactions/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },
  downloadCsv: async () => {
    const res = await api.get('/transactions/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `smartspend_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

export const budgetService = {
  getAll: async (params = {}) => {
    const res = await api.get('/budgets', { params });
    return res.data;
  },
  saveOrUpdate: async (data) => {
    const res = await api.post('/budgets', data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },
  getStatus: async (params = {}) => {
    const res = await api.get('/budgets/status', { params });
    return res.data;
  }
};

export const dashboardService = {
  getSummary: async () => {
    const res = await api.get('/dashboard/summary');
    return res.data;
  }
};

export default api;
