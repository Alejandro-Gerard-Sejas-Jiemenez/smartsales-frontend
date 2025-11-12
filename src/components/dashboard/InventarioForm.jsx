import { useEffect, useState } from "react";

export default function InventarioForm({
  initialInventario = null,
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialInventario;
  
  // 1. Estado del formulario
  const [form, setForm] = useState({
    codigo: "",
    estado: true
  });
  const [touched, setTouched] = useState({});

  // 2. Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialInventario) {
      setForm({
        codigo: initialInventario.codigo || "",
        estado: typeof initialInventario.estado === "boolean" ? initialInventario.estado : true
      });
    } else {
      setForm({ codigo: "", estado: true });
    }
  }, [initialInventario]);

  // 3. Helper para actualizar campos
  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  // 4. Lógica de envío
  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ codigo: true });
    if (!form.codigo) return;
    
    // Empaquetamos el payload igual que en CategoriaForm
    const payload = {
      id: initialInventario?.id,
      codigo: String(form.codigo).trim(),
      estado: Boolean(form.estado)
    };
    onSubmit(payload);
  }

  // 5. Validación
  const invalid = {
    codigo: touched.codigo && !form.codigo
  };

  // 6. JSX
  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        
        {/* --- Cabecera y Botones --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Almacén" : "Nuevo Almacén"}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow disabled:opacity-60"
            >
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Almacén"}
            </button>
          </div>
        </div>

        {/* --- Campos del Formulario --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Código *"
            error={invalid.codigo && "Requerido"}
            children={
              <input
                value={form.codigo}
                onChange={e => setField("codigo", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, codigo: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.codigo ? "input-error" : ""}`}
                placeholder="Ej: ALM-CENTRAL, SUC-NORTE"
              />
            }
          />
          <Field
            label="Estado"
            children={
              <div className="flex items-center gap-2 h-[46px] px-4 rounded-2xl border border-gray-300 bg-white">
                <input
                  type="checkbox"
                  checked={form.estado}
                  onChange={e => setField("estado", e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {form.estado ? "Activo" : "Inactivo"}
                </span>
              </div>
            }
          />
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> El código es obligatorio e identifica al almacén (ej. sucursal, bodega principal).
        </div>
      </form>
    </div>
  );
}

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