import { useEffect, useState } from "react";


const ESTADO_CHOICES = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Agotado', label: 'Agotado' },
  { value: 'Descontinuado', label: 'Descontinuado' },
];

// Mapea el estado 'true' antiguo a 'Disponible'
const mapEstado = (oldEstado) => {
  if (oldEstado === true || oldEstado === 'Disponible') return 'Disponible';
  if (oldEstado === false || oldEstado === 'Descontinuado') return 'Descontinuado';
  if (oldEstado === 'Agotado') return 'Agotado';
  return 'Disponible'; // Valor por defecto si es nulo o indefinido
};

export default function ProductoForm({
  initialProducto = null,
  categorias = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialProducto;

  const [form, setForm] = useState({
    codigo_producto: "",
    nombre: "",
    descripcion: "",
    precio_venta: "",
    precio_compra: "",
    imagen_url: "",
    estado: "Disponible",
    stock_actual: 0,
    ano_garantia: 0,
    categoria: "",
    marca: "",
  });
  
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialProducto) {
      setForm({
        codigo_producto: initialProducto.codigo_producto || "",
        nombre: initialProducto.nombre || "",
        descripcion: initialProducto.descripcion || "",
        precio_venta: initialProducto.precio_venta || "",
        precio_compra: initialProducto.precio_compra || "",
        imagen_url: initialProducto.imagen_url || "",
        estado: mapEstado(initialProducto.estado),
        stock_actual: initialProducto.stock_actual || 0,
        ano_garantia: initialProducto.ano_garantia || 0,
        categoria: initialProducto.categoria || "",
        marca: initialProducto.marca || "",
      });
    } else {
      setForm({
        codigo_producto: "",
        nombre: "",
        descripcion: "",
        precio_venta: "",
        precio_compra: "",
        imagen_url: "",
        estado: "Disponible",
        stock_actual: 0,
        ano_garantia: 0,
        categoria: "",
        marca: "",
      });
    }
  }, [initialProducto]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      codigo_producto: true,
      nombre: true,
      precio_venta: true,
      precio_compra: true,
      categoria: true
    });
    if (!form.codigo_producto || !form.nombre || !form.precio_venta || !form.precio_compra || !form.categoria) return;
    
    const payload = {
      ...form,
      id: initialProducto?.id,
    };
    
    if (!payload.descripcion) delete payload.descripcion;
    if (!payload.imagen_url) delete payload.imagen_url;
    if (!payload.marca) delete payload.marca;
    
    onSubmit(payload); // Envía el objeto JSON
  }

  const invalid = {
    codigo_producto: touched.codigo_producto && !form.codigo_producto,
    nombre: touched.nombre && !form.nombre,
    precio_venta: touched.precio_venta && !form.precio_venta,
    precio_compra: touched.precio_compra && !form.precio_compra,
    categoria: touched.categoria && !form.categoria
  };

  return (
    <div className="w-full flex justify-center px-3">
      <form onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-3xl border border-gray-200 shadow p-6 sm:p-8 flex flex-col gap-8">
        
        {/* --- Cabecera y Botones --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Editar Producto" : "Nuevo Producto"}
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
              {loading ? "Guardando..." : editMode ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </div>

        {/* --- CAMBIO: Rejilla de 3 columnas para más campos --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Campos de Texto (con 'marca' añadido) --- */}
          <Field
            label="Código Producto *"
            error={invalid.codigo_producto && "Requerido"}
            children={
              <input
                value={form.codigo_producto}
                onChange={e => setField("codigo_producto", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, codigo_producto: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.codigo_producto ? "input-error" : ""}`}
                placeholder="Ej: PROD-001"
              />
            }
          />
          <Field
            label="Nombre *"
            error={invalid.nombre && "Requerido"}
            children={
              <input
                value={form.nombre}
                onChange={e => setField("nombre", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.nombre ? "input-error" : ""}`}
                placeholder="Nombre del producto"
              />
            }
          />
          <Field
            label="Marca"
            children={
              <input
                value={form.marca}
                onChange={e => setField("marca", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="Ej: Sony, Samsung, etc."
              />
            }
          />

          {/* --- Precios --- */}
          <Field
            label="Precio Venta *"
            error={invalid.precio_venta && "Requerido"}
            children={
              <input
                type="number"
                value={form.precio_venta}
                onChange={e => setField("precio_venta", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, precio_venta: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.precio_venta ? "input-error" : ""}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            }
          />
          <Field
            label="Precio Compra *"
            error={invalid.precio_compra && "Requerido"}
            children={
              <input
                type="number"
                value={form.precio_compra}
                onChange={e => setField("precio_compra", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, precio_compra: true }))}
                disabled={loading}
                required
                className={`input-base ${invalid.precio_compra ? "input-error" : ""}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            }
          />
          
          {/* --- CAMBIO: Select de Estado --- */}
          <Field
            label="Estado"
            children={
              <select
                value={form.estado}
                onChange={e => setField("estado", e.target.value)}
                disabled={loading}
                className="input-base"
              >
                {ESTADO_CHOICES.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            }
          />

          {/* --- Detalles (con 'fecha_vencimiento') --- */}
          <Field
            label="Categoría *"
            error={invalid.categoria && "Requerido"}
            children={
              <select
                value={form.categoria}
                onChange={e => setField("categoria", e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, categoria: true }))}
                disabled={loading || editMode}
                className={`input-base ${invalid.categoria ? "input-error" : ""}`}
                required
              >
                <option value="">Seleccione una categoría...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            }
          />
          <Field
            label="Stock Actual"
            children={
              <input
                type="number"
                value={form.stock_actual}
                onChange={e => setField("stock_actual", e.target.value)}
                disabled={loading}
                className="input-base"
                min="0"
              />
            }
          />

          {/* --- Otros --- */}
          <Field
            label="Año Garantía"
            children={
              <input
                type="number"
                value={form.ano_garantia}
                onChange={e => setField("ano_garantia", e.target.value)}
                disabled={loading}
                className="input-base"
                min="0"
              />
            }
          />
          
          {/* --- CAMBIO: De 'file' a 'text' para URL --- */}
          <Field
            label="URL de la Imagen"
            children={
              <input
                type="text"
                value={form.imagen_url}
                onChange={e => setField("imagen_url", e.target.value)}
                disabled={loading}
                className="input-base"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            }
          />
          
          {/* --- Descripción --- */}
          <div className="md:col-span-3">
            <Field
              label="Descripción"
              children={
                <textarea
                  value={form.descripcion}
                  onChange={e => setField("descripcion", e.target.value)}
                  disabled={loading}
                  className="input-base"
                  placeholder="Descripción detallada del producto..."
                  rows={3}
                />
              }
            />
          </div>

        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> Los campos marcados con * son obligatorios. El stock se actualiza al registrar ingresos en Inventario.
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
