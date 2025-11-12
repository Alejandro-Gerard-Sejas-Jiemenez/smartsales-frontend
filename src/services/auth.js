// Importamos el cliente API
import { api } from './apiClient.js';

// --- Funciones de LocalStorage ---
export function setToken(t){ localStorage.setItem('token', t); }
export function getToken(){ return localStorage.getItem('token'); }
export function setUser(u){ localStorage.setItem('user', JSON.stringify(u)); }
export function getUser(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
export function clearAuth(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// --- Funciones de API ---
/**
 * Llama a la API de login y gestiona la sesión.
 * @param {string} correo - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 */
export async function login(correo, password) {
  try {
    // 1. Llama a la API de login
    const data = await api.post("/api/acceso_seguridad/token/", { correo, password });

    if (!data.access) {
      throw new Error("No se recibió token de acceso");
    }

    setToken(data.access);
    setUser(data.usuario);

    const esAdmin = data.usuario?.rol === 'ADMIN' || 
                    data.usuario?.rol === 'Administrador' ||
                    data.usuario?.is_superuser;
    
    return { 
      usuario: data.usuario, 
      esAdmin: esAdmin 
    };

  } catch (err) {
    console.error("Error en servicio auth.js/login:", err);
    throw err; 
  }
}

/**
 * Llama a la API de registro.
 * @param {object} datosRegistro - { nombre, apellido, correo, password, rol }
 */
export async function registro(datosRegistro) {
  return api.post('/api/acceso_seguridad/registro/', datosRegistro);
}


/**
 * Solicita un token de recuperación de contraseña al backend.
 * @param {string} correo - El email del usuario.
 */
export async function solicitarRecuperacion(correo) {
  return api.post('/api/acceso_seguridad/solicitar-recuperacion/', { correo });
}

/**
 * Envía el token y la nueva contraseña al backend para confirmar.
 * @param {string} token - El token que el usuario recibió por email.
 * @param {string} nueva_password - La nueva contraseña del usuario.
 * @param {string} confirmar_password - La confirmación de la contraseña.
 */
export async function confirmarRecuperacion(token, nueva_password, confirmar_password) {
  return api.post('/api/acceso_seguridad/confirmar-recuperacion/', {
    token,
    nueva_password,
    confirmar_password
  });
}