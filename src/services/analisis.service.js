import { api } from './apiClient.js'; 

// === API Predicciones (CU-16) ===

/**
 * Obtiene las predicciones de ventas.
 * @param {object} params - Opcional. Objeto de filtros.
 * @param {number} params.categoria - Filtra por ID de categoría.
 */
export const getPredicciones = (params) => 
  api.get('/api/predicciones/', params);

export const getAnalisisTendencias = (params) => 
  api.get('/api/ventas/analisis-tendencias/', params);

// (Aquí irán las futuras APIs de Reportes Dinámicos)
export const generarReporteDinamico = (prompt) => {
  return api.post('/api/reportes/generar_reporte/', { prompt }, {
    _fetchFile: true 
  });
}