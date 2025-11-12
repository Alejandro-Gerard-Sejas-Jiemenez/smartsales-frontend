import { api } from './apiClient.js'; 

// === API Categorías (CU-07) ===

export const getCategorias = () => 
  api.get('/api/categorias/');

export const getCategoriaById = (id) => 
  api.get(`/api/categorias/${id}/`);

export const createCategoria = (data) => 
  api.post('/api/categorias/', data); // data = { nombre: "..." }

export const updateCategoria = (id, data) => 
  api.put(`/api/categorias/${id}/`, data);

export const deleteCategoria = (id) => 
  api.del(`/api/categorias/${id}/`);

// === API Productos (CU-08) ===

export const getProductos = () => 
  api.get('/api/productos/');

export const getProductoById = (id) => 
  api.get(`/api/productos/${id}/`);

export const createProducto = (data) => 
  api.post('/api/productos/', data);

export const updateProducto = (id, data) => 
  api.put(`/api/productos/${id}/`, data);

export const deleteProducto = (id) => 
  api.del(`/api/productos/${id}/`);

// === API Inventarios (CU-09 - Almacenes) ===

export const getInventarios = () => 
  api.get('/api/inventarios/');

export const getInventarioById = (id) => 
  api.get(`/api/inventarios/${id}/`);

export const createInventario = (data) => 
  api.post('/api/inventarios/', data); // data = { codigo: "..." }

export const updateInventario = (id, data) => 
  api.put(`/api/inventarios/${id}/`, data);

export const deleteInventario = (id) => 
  api.del(`/api/inventarios/${id}/`);

// === API Ingresos de Inventario (CU-09 - Registrar Ingreso) ===

export const getIngresos = () => 
  api.get('/api/inventario-productos/');

export const createIngreso = (data) => 
  api.post('/api/inventario-productos/', data);