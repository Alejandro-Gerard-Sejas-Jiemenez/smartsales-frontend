import { api } from './apiClient';
/**
 * Obtiene la lista de todos los clientes, con opción de búsqueda.
 * Llama a: GET /api/clientes/  o  GET /api/clientes/?search=...
 * @param {string} [search]
 */
export const getClientes = (search = '') => {
  let url = '/api/clientes/';
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  return api.get(url);
};

/**
 * Crea un nuevo cliente (Usuario + Perfil Cliente).
 * Llama a: POST /api/clientes/
 * @param {object} data - Datos del cliente (incluye password y datos de 'cliente' anidados)
 */
export const createCliente = (data) => {
  return api.post('/api/clientes/', data);
};

/**
 * Actualiza un cliente existente (Usuario + Perfil Cliente).
 * Llama a: PUT /api/clientes/{id}/
 * @param {number} id
 * @param {object} data
 */
export const updateCliente = (id, data) => {
  return api.put(`/api/clientes/${id}/`, data);
};

/**
 * Elimina un cliente (Usuario).
 * Llama a: DELETE /api/clientes/{id}/
 * @param {number} id
 */
export const deleteCliente = (id) => {
  return api.del(`/api/clientes/${id}/`);
};

/**
 * Cambia el estado (activo/inactivo) de un usuario cliente.
 * Llama a: POST /api/clientes/{id}/toggle-estado/
 * @param {number} id
 */
export const toggleEstadoCliente = (id) => {
  return api.post(`/api/clientes/${id}/toggle-estado/`);
};