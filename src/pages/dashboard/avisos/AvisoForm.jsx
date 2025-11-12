import { useState, useEffect } from "react";

export default function AvisoForm({ initialAviso = null, onSubmit, onCancel, loading = false }) {
  const editMode = !!initialAviso;
  const [touched, setTouched] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: initialAviso?.titulo || "",
    mensaje: initialAviso?.mensaje || "",
    tipo: initialAviso?.tipo || "Informativo",
    estado: initialAviso?.estado || "Activo",
    modo_envio: initialAviso?.modo_envio || "inmediato", // NUEVO: inmediato o programado
    fecha_programada: initialAviso?.fecha_programada || "",
    hora_programada: initialAviso?.hora_programada || "",
    imagen_url: initialAviso?.imagen_url || "",
    link_accion: initialAviso?.link_accion || "",
    prioridad: initialAviso?.prioridad || 1
  });

  useEffect(() => {
    if (initialAviso) {
      setFormData({
        titulo: initialAviso.titulo || "",
        mensaje: initialAviso.mensaje || "",
        tipo: initialAviso.tipo || "Informativo",
        estado: initialAviso.estado || "Activo",
        modo_envio: initialAviso.modo_envio || "inmediato",
        fecha_programada: initialAviso.fecha_programada || "",
        hora_programada: initialAviso.hora_programada || "",
        imagen_url: initialAviso.imagen_url || "",
        link_accion: initialAviso.link_accion || "",
        prioridad: initialAviso.prioridad || 1
      });
    }
  }, [initialAviso]);

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    
    if (!formData.titulo.trim() || !formData.mensaje.trim()) return;

    const dataToSubmit = {
      ...formData,
      id: initialAviso?.id
    };

    onSubmit(dataToSubmit);
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const invalid = touched && (!formData.titulo.trim() || !formData.mensaje.trim());

  return (
    <div className="w-full flex justify-center px-3">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center gap-2">
          {editMode ? "Editar Aviso" : "Crear Aviso"}
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
            {editMode ? "Edición" : "Nuevo"}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              onBlur={() => setTouched(true)}
              disabled={loading}
              maxLength={100}
              required
              className={`w-full px-4 py-3 rounded-2xl border text-sm bg-white focus:outline-none focus:ring-2 transition
                ${invalid && !formData.titulo.trim() ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"}
              `}
              placeholder="Título del aviso"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>{formData.titulo.length}/100</span>
              {touched && !formData.titulo.trim() && <span className="text-red-500">Requerido</span>}
            </div>
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="Promoción">Promoción</option>
              <option value="Oferta">Oferta</option>
              <option value="Informativo">Informativo</option>
              <option value="Urgente">Urgente</option>
              <option value="Actualización">Actualización</option>
            </select>
          </div>

          {/* Mensaje */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              Mensaje <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.mensaje}
              onChange={(e) => handleChange('mensaje', e.target.value)}
              onBlur={() => setTouched(true)}
              disabled={loading}
              maxLength={500}
              required
              rows={4}
              className={`w-full px-4 py-3 rounded-2xl border text-sm bg-white focus:outline-none focus:ring-2 transition resize-none
                ${invalid && !formData.mensaje.trim() ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"}
              `}
              placeholder="Contenido del mensaje"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>{formData.mensaje.length}/500</span>
              {touched && !formData.mensaje.trim() && <span className="text-red-500">Requerido</span>}
            </div>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Programado">Programado</option>
            </select>
          </div>

          {/* Prioridad */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Prioridad (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.prioridad}
              onChange={(e) => handleChange('prioridad', parseInt(e.target.value) || 1)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Modo de Envío */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Modo de Envío</label>
            <select
              value={formData.modo_envio}
              onChange={(e) => handleChange('modo_envio', e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="inmediato">⚡ Envío Inmediato (al crear)</option>
              <option value="programado">📅 Programar fecha y hora</option>
            </select>
          </div>

          {/* Campos de Programación (solo si modo_envio === 'programado') */}
          {formData.modo_envio === 'programado' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fecha_programada}
                  onChange={(e) => handleChange('fecha_programada', e.target.value)}
                  disabled={loading}
                  required={formData.modo_envio === 'programado'}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600">
                  Hora <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.hora_programada}
                  onChange={(e) => handleChange('hora_programada', e.target.value)}
                  disabled={loading}
                  required={formData.modo_envio === 'programado'}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>
            </>
          )}

          {/* Imagen URL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Fecha Programada</label>
            <input
              type="datetime-local"
              value={formData.fecha_programada}
              onChange={(e) => handleChange('fecha_programada', e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Imagen URL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              URL de Imagen <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="url"
              value={formData.imagen_url}
              onChange={(e) => handleChange('imagen_url', e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="text-xs text-gray-500">
              💡 Imagen que aparecerá en la notificación. Déjalo vacío si no necesitas imagen.
            </p>
          </div>

          {/* Link Acción */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              Link de Acción <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="url"
              value={formData.link_accion}
              onChange={(e) => handleChange('link_accion', e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="https://ejemplo.com/accion"
            />
            <p className="text-xs text-gray-500">
              💡 URL a donde llevará al usuario al tocar la notificación. Déjalo vacío si no necesitas redirección.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50
                       transition shadow-sm disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || invalid}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500
                       hover:from-blue-500 hover:to-blue-600 shadow-md hover:shadow-lg transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Aviso"}
          </button>
        </div>
      </form>
    </div>
  );
}
