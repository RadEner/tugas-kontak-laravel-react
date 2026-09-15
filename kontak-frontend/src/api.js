const BASE_URL = 'http://127.0.0.1:8000/api';

export const apiFetch = (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};