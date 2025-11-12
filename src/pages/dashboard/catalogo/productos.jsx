import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ProductoForm from "../../../components/dashboard/ProductoForm.jsx";

import {
  getProductos,
  getCategorias,
  createProducto,
  updateProducto,
  deleteProducto as srvDeleteProducto
} from "../../../services/catalogo.service.js";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

const estadoStyles = {
  'Disponible': "bg-green-100 text-green-700",
  'Agotado': "bg-yellow-100 text-yellow-700",
  'Descontinuado': "bg-red-100 text-red-600",
};

export default function ProductosPage() {
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteProducto, setDeleteProducto] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([
      getProductos(),
      getCategorias()
    ])
      .then(([p, c]) => {
        setProductos(Array.isArray(p) ? p : []);
        setCategorias(Array.isArray(c) ? c : []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  // Crear
  function onCreate() {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Editar
  function onEdit(row) {
    const producto = productos.find(p => p.id === row.id);
    if (!producto) return;
    setEditing(producto);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Guardar (crear/editar)
  function saveProducto(data) {
    setLoading(true);
    const isEdit = !!data.id;

    const promise = isEdit 
      ? updateProducto(data.id, data) 
      : createProducto(data);

    promise
      .then(() => {
        setShowForm(false);
        setEditing(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  // Eliminar
  function onDelete(row) {
    const producto = productos.find(p => p.id === row.id);
    if (!producto) return;
    setDeleteProducto(producto);
  }

  function confirmDelete() {
    if (!deleteProducto) return;
    setLoading(true);
    
    srvDeleteProducto(deleteProducto.id)
      .then(() => {
        setDeleteProducto(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  // --- MEJORA: Mapeo simplificado ---
  const rows = productos.map(p => ({
    ...p,
    categoria: p.categoria_nombre
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <ProductoForm
          initialProducto={editing}
          categorias={categorias}
          onSubmit={saveProducto}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && (
        <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <SmartTable
        titulo="Productos"
        data={rows}
        loading={loading}
        columns={[ 
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "codigo_producto", label: "Código", enableSort: true },
          { key: "nombre", label: "Nombre", enableSort: true },
          { key: "categoria", label: "Categoría" }, // Ahora usa 'p.categoria_nombre'
          { key: "precio_venta", label: "Precio Venta" },
          { key: "precio_compra", label: "Precio Compra" },
          { key: "stock_actual", label: "Stock" },
          { key: "imagen_url", label: "Imagen", render: (row) => (
            row.imagen_url 
              ? <img src={row.imagen_url} alt={row.nombre} style={{width:40, height:40, objectFit:'cover', borderRadius:8}} /> 
              : <span style={{color:'#aaa'}}>Sin imagen</span>
          ), width: "60px" },
          
          { key: "estado", label: "Estado", render: (row) => {
              const style = estadoStyles[row.estado] || "bg-gray-100 text-gray-700";
              return (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${style}`}>
                  {row.estado || "N/A"}
                </span>
              )
            }, width: "110px" 
          },

        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteProducto}
        title="Eliminar Producto"
        message={`¿Seguro que deseas eliminar el producto "${deleteProducto?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteProducto(null)}
      />
    </div>
  );
}
