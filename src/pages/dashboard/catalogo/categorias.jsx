import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import CategoriaForm from "../../../components/dashboard/CategoriaForm.jsx";

import { 
  getCategorias, 
  createCategoria, 
  updateCategoria, 
  deleteCategoria as srvDeleteCategoria
} from "../../../services/catalogo.service.js";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function CategoriasPage() {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteCategoria, setDeleteCategoria] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    getCategorias()
      .then((c) => {
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
    const categoria = categorias.find(c => c.id === row.id);
    if (!categoria) return;
    setEditing(categoria);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Guardar (crear/editar)
  function saveCategoria(data) {
    setLoading(true);
    const isEdit = !!data.id;
    
    const promise = isEdit 
      ? updateCategoria(data.id, data) 
      : createCategoria(data);

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
    const categoria = categorias.find(c => c.id === row.id);
    if (!categoria) return;
    setDeleteCategoria(categoria);
  }

  function confirmDelete() {
    if (!deleteCategoria) return;
    setLoading(true);
    
    srvDeleteCategoria(deleteCategoria.id)
      .then(() => {
        setDeleteCategoria(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  
  const rows = categorias.map(c => ({
    id: c.id,
    nombre: c.nombre,
    estado: c.estado
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <CategoriaForm
          initialCategoria={editing}
          onSubmit={saveCategoria}
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
        titulo="Categorías"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "nombre", label: "Nombre", enableSort: true },
          {
            key: "estado",
            label: "Estado",
            render: (row) => (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  row.estado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
              >
                {row.estado ? "Activo" : "Inactivo"}
              </span>
            ),
            width: "110px"
          }
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteCategoria}
        title="Eliminar Categoría"
        message={`¿Seguro que deseas eliminar la categoría "${deleteCategoria?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCategoria(null)}
      />
    </div>
  );
}
