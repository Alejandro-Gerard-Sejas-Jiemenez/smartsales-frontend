import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaSpinner } from 'react-icons/fa';

export default function ClienteForm({
  initialCliente = null,
  onSubmit,
  onCancel,
  loading = false
}) {
  
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
    ciudad: '',
    codigo_postal: '',
    is_active: true,
  });
  
  const [error, setError] = useState(null);
  const isEditMode = Boolean(initialCliente?.id);

  useEffect(() => {
    if (isEditMode) {
      setForm({
        id: initialCliente.id,
        nombre: initialCliente.nombre || '',
        apellido: initialCliente.apellido || '',
        correo: initialCliente.correo || '',
        telefono: initialCliente.telefono || '',
        password: '', // Contraseña siempre vacía por seguridad
        ciudad: initialCliente.ciudad || '', // Leemos 'initialCliente.ciudad'
        codigo_postal: initialCliente.codigo_postal || '', // Leemos 'initialCliente.codigo_postal'
        is_active: initialCliente.is_active,
      });
    } else {
      // Reseteamos el formulario
      setForm({
        id: null, nombre: '', apellido: '', correo: '', telefono: '',
        password: '', ciudad: '', codigo_postal: '', is_active: true,
      });
    }
  }, [initialCliente]); // Depende solo de initialCliente

  // Manejador genérico
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  // Manejador para el botón 'is_active'
  const handleToggleActive = () => {
    setForm(prevForm => ({ ...prevForm, [name]: !prevForm.is_active }));
  };

  // --- Manejador del Envío ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.correo) {
      setError("El correo es obligatorio.");
      return;
    }
    if (!isEditMode && !form.password) {
      setError("La contraseña es obligatoria al crear un nuevo cliente.");
      return;
    }
    
    // Enviamos el objeto 'form' PLANO a la función 'saveCliente'
    // (que está en 'clientes.jsx')
    onSubmit(form);
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : null}
              {isEditMode ? "Guardar Cambios" : "Crear Cliente"}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg -mt-4">
            {error}
          </div>
        )}

        {/* Campos del Formulario (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Columna 1: Datos de Usuario */}
          <Field label="Nombre">
            <input name="nombre" value={form.nombre} onChange={handleChange} disabled={loading}
              className="input-base" placeholder="Nombre del cliente"
            />
          </Field>
          
          <Field label="Apellido">
            <input name="apellido" value={form.apellido} onChange={handleChange} disabled={loading}
              className="input-base" placeholder="Apellido del cliente"
            />
          </Field>
          
          <Field label="Correo Electrónico *">
            <input name="correo" type="email" value={form.correo} onChange={handleChange} disabled={loading}
              required className="input-base"
            />
          </Field>
          
          <Field label="Teléfono">
            <input name="telefono" value={form.telefono} onChange={handleChange} disabled={loading}
              className="input-base" placeholder="Ej: +591 7..."
            />
          </Field>
          
          <Field label={isEditMode ? "Nueva Contraseña (Opcional)" : "Contraseña *"}>
            <input name="password" type="password" value={form.password} onChange={handleChange} disabled={loading}
              required={!isEditMode} className="input-base"
              placeholder={isEditMode ? "Dejar en blanco para no cambiar" : "Requerida al crear"}
            />
          </Field>

          {/* Columna 2: Datos de Cliente y Estado */}
          <Field label="Ciudad">
            <input name="ciudad" value={form.ciudad} onChange={handleChange} disabled={loading}
              className="input-base" placeholder="Ej: Santa Cruz"
            />
          </Field>
          
          <Field label="Código Postal">
            <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} disabled={loading}
              className="input-base" placeholder="Ej: 12345"
            />
          </Field>
          
          <Field label="Estado">
            <button type="button" onClick={handleToggleActive}
              className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                form.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {form.is_active ? <FaToggleOn size={22} className="text-green-500" /> : <FaToggleOff size={22} className="text-gray-400" />}
              {form.is_active ? 'Activo' : 'Inactivo'}
            </button>
          </Field>
        </div>
      </form>
    </div>
  );
}

// Componente helper para los campos
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide text-gray-600">
        {label}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
