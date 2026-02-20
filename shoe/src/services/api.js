const BASE = '/api';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('shoeUser') || '{}');
  return user.token || '';
};

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const api = {
  get: async (path) => {
    const res = await fetch(`${BASE}${path}`, { headers: headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
  post: async (path, body) => {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
  put: async (path, body) => {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
  delete: async (path) => {
    const res = await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: headers(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};