import { useState } from "react";

export default function IngresoForm({
  inventarios = [],
  productos = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  
  // 1. Estado del formulario
  const [form, setForm] = useState({
    inventario: "",
    producto_id: "",
    cantidad: ""
  });
  const [touched, setTouched] = useState({});

  // 2. Helper para actualizar campos
  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  // 3. Lógica de envío
  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ inventario: true, producto_id: true, cantidad: true });
    
    // Validamos
    if (!form.inventario || !form.producto_id || !form.cantidad || form.cantidad <= 0) {
      return;
    }
    
    // Empaquetamos el payload
    const payload = {
      inventario: parseInt(form.inventario),
      producto_id: parseInt(form.producto_id), // El backend espera 'producto_id'
      cantidad: parseInt(form.cantidad)
    };
    onSubmit(payload);
  }

  // 4. Validación
  const invalid = {
    inventario: touched.inventario && !form.inventario,
    producto_id: touched.producto_id && !form.producto_id,
    cantidad: touched.cantidad && (!form.cantidad || form.cantidad <= 0),
  };

  // 5. JSX (replicando tu diseño)
  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        
        {/* --- Cabecera y Botones --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Registrar Ingreso de Stock
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
              {loading ? "Registrando..." : "Registrar Ingreso"}
            </button>
          </div>
        </div>

        {/* --- Campos del Formulario --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Almacén de Destino *"
            error={invalid.inventario && "Seleccione un almacén"}
            children={
              <select
                value={form.inventario}
                onChange={e => setField("inventario", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, inventario: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.inventario ? "input-error" : ""}`}
              >
                <option value="">Seleccione un almacén...</option>
                {inventarios.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.codigo}</option>
                ))}
              </select>
            }
          />
          <Field
            label="Producto a Ingresar *"
            error={invalid.producto_id && "Seleccione un producto"}
            children={
              <select
                value={form.producto_id}
                onChange={e => setField("producto_id", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, producto_id: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.producto_id ? "input-error" : ""}`}
              >
                <option value="">Seleccione un producto...</option>
                {/* Mostramos solo productos Disponibles y su stock actual */}
                {productos
                  .filter(p => p.estado === 'Disponible')
                  .map(prod => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre} (Stock actual: {prod.stock_actual})
                    </option>
                ))}
              </select>
            }
          />
          <div className="md:col-span-2">
            <Field
              label="Cantidad a Ingresar *"
              error={invalid.cantidad && "Debe ser un número mayor a 0"}
              children={
                <input
                  type="number"
                  value={form.cantidad}
                  onChange={e => setField("cantidad", e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, cantidad: true }))}
                  disabled={loading}
                  required
                  className={`input-base ${invalid.cantidad ? "input-error" : ""}`}
                  placeholder="0"
                  min="1"
                />
              }
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Importante:</strong> Al registrar un ingreso, el <strong>Stock Actual</strong> del producto seleccionado se incrementará automáticamente.
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