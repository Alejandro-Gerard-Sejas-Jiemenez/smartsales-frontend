
import { api } from './apiClient.js'; 

export const getVentas = (params) => 
  api.get('/api/ventas/', params);

export const getVentaById = (id) => 
  api.get(`/api/ventas/${id}/`);

/**
 * Crea una nueva Venta (Manual)
 * @param {object} data - Datos de la venta
 * @param {number} data.cliente - ID del cliente
 * @param {string} data.metodo_entrada - Ej: 'Mostrador', 'Telefono'
 * @param {string} data.tipo_venta - Ej: 'Contado'
 * @param {array} data.detalles - Lista de productos
 * @param {number} data.detalles[].producto_id - ID del producto
 * @param {number} data.detalles[].cantidad - Cantidad
 */
export const createVenta = (data) => 
  api.post('/api/ventas/', data);

export const getComprobanteVenta = (id) => 
  api.getFile(`/api/ventas/${id}/comprobante/`);

export const getAnalisisTendencias = () => 
  api.get('/api/ventas/analisis-tendencias/');
