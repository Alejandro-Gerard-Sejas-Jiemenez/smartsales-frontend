import { getToken, clearAuth } from "./auth.js";

// Configuración simple y directa
const API_BASE = import.meta.env.VITE_API_BASE || "https://smartsales-backend-paph.onrender.com";


export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // En desarrollo local: usar proxy (/api)
  // En producción: usar URL completa
  const isDev = import.meta.env.DEV;
  const isLocal = window.location.hostname === 'localhost';
  
  let fullUrl;
  if (isDev && isLocal) {
    // Desarrollo local: usar rutas relativas (proxy se encarga)
    fullUrl = url;
  } else {
    // Producción: URL completa
    fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  }
  

  const res = await fetch(fullUrl, { ...options, headers });

  let data = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('❌ Error parsing JSON:', e);
  }

  if (res.status === 401) {
    clearAuth();
    if (!url.includes('/login')) window.location.href = '/login';
  }
  
  if (!res.ok) {
    throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
  }
  
  return data;
}

export async function apiFetchFile(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const isDev = import.meta.env.DEV;
  const isLocal = window.location.hostname === 'localhost';

  let fullUrl;
  if (isDev && isLocal) {
    fullUrl = url;
  } else {
    fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  }

  const res = await fetch(fullUrl, { ...options, headers });

  if (res.status === 401) {
    clearAuth();
    if (!url.includes('/login')) window.location.href = '/login';
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  // Devuelve el 'blob' (el archivo binario)
  return res.blob(); 
}

export const api = {
  get: (u, params = null) => {
    let url = u;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      if (queryParams) {
        url += `?${queryParams}`;
      }
    }
    return apiFetch(url);
  },
  post: (u, b, opts = {}) => {
    if (opts._fetchFile) {
      return apiFetchFile(u, { method: 'POST', body: JSON.stringify(b) });
    }
    return apiFetch(u, { method: 'POST', body: JSON.stringify(b) });
  },
  put: (u, b) => apiFetch(u, { method: 'PUT', body: JSON.stringify(b) }),
  patch: (u, b) => apiFetch(u, { method: 'PATCH', body: JSON.stringify(b) }),
  del: (u) => apiFetch(u, { method: 'DELETE' }),
  getFile: (u) => apiFetchFile(u)
};