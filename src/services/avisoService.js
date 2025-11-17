import axios from 'axios';

// Por defecto en local apuntamos al backend local
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

// Crear instancia de axios con configuración
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const avisoService = {
  // Obtener todos los avisos (con paginación y filtros)
  getAvisos: async (params = {}) => {
    const response = await api.get('/api/acceso_seguridad/avisos/', { params });
    return response.data;
  },

  // Obtener un aviso por ID
  getAviso: async (id) => {
    const response = await api.get(`/api/acceso_seguridad/avisos/${id}/`);
    return response.data;
  },

  // Crear nuevo aviso
  createAviso: async (data) => {
    // Limpiar datos antes de enviar - MAPEAR titulo -> asunto
    const cleanData = {
      asunto: data.titulo,  // ⭐ CAMBIO: El backend espera 'asunto', no 'titulo'
      mensaje: data.mensaje,
      tipo: data.tipo || 'Informativo',
      estado: data.estado || 'Activo',
      prioridad: data.prioridad || 1,
    };
    
    // Solo agregar campos opcionales si tienen valor
    if (data.fecha_programada) cleanData.fecha_programada = data.fecha_programada;
    if (data.imagen_url && data.imagen_url.trim()) cleanData.imagen_url = data.imagen_url;
    if (data.link_accion && data.link_accion.trim()) cleanData.link_accion = data.link_accion;
    
    console.log('📤 Datos limpios a enviar:', cleanData);
    
    const response = await api.post('/api/acceso_seguridad/avisos/', cleanData);
    return response.data;
  },

  // Actualizar aviso
  updateAviso: async (id, data) => {
    // Limpiar datos antes de enviar - MAPEAR titulo -> asunto
    const cleanData = {
      asunto: data.titulo,  // ⭐ CAMBIO: El backend espera 'asunto', no 'titulo'
      mensaje: data.mensaje,
      tipo: data.tipo || 'Informativo',
      estado: data.estado || 'Activo',
      prioridad: data.prioridad || 1,
    };
    
    // Solo agregar campos opcionales si tienen valor
    if (data.fecha_programada) cleanData.fecha_programada = data.fecha_programada;
    if (data.imagen_url && data.imagen_url.trim()) cleanData.imagen_url = data.imagen_url;
    if (data.link_accion && data.link_accion.trim()) cleanData.link_accion = data.link_accion;
    
    const response = await api.put(`/api/acceso_seguridad/avisos/${id}/`, cleanData);
    return response.data;
  },

  // Actualizar parcialmente aviso
  patchAviso: async (id, data) => {
    const response = await api.patch(`/api/acceso_seguridad/avisos/${id}/`, data);
    return response.data;
  },

  // Eliminar aviso
  deleteAviso: async (id) => {
    const response = await api.delete(`/api/acceso_seguridad/avisos/${id}/`);
    return response.data;
  },

  // Enviar aviso ahora (acción personalizada)
  enviarAviso: async (id) => {
    const response = await api.post(`/api/acceso_seguridad/avisos/${id}/enviar/`);
    return response.data;
  },

  // Obtener estadísticas del aviso
  getEstadisticas: async (id) => {
    const response = await api.get(`/api/acceso_seguridad/avisos/${id}/estadisticas/`);
    return response.data;
  },

  // Obtener clientes disponibles para seleccionar destinatarios
  getClientes: async () => {
    const response = await api.get('/api/catalogo/clientes/');
    return response.data;
  },

  // Obtener avisos activos
  getAvisosActivos: async () => {
    const response = await api.get('/api/acceso_seguridad/avisos/', { 
      params: { estado: 'Activo' } 
    });
    return response.data;
  },
};

export default avisoService;
