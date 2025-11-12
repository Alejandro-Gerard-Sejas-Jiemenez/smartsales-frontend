import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import InventarioForm from "../../../components/dashboard/InventarioForm.jsx";
import {
  getInventarios,
  createInventario,
  updateInventario,
  deleteInventario as srvDeleteInventario
} from "../../../services/catalogo.service.js";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function InventariosPage() {
  const [loading, setLoading] = useState(false);
  const [inventarios, setInventarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteAlmacen, setDeleteAlmacen] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    getInventarios()
      .then((data) => {
        setInventarios(Array.isArray(data) ? data : []);
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
    const almacen = inventarios.find(i => i.id === row.id);
    if (!almacen) return;
    setEditing(almacen);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Guardar (crear/editar)
  function saveInventario(data) {
    setLoading(true);
    const isEdit = !!data.id;
    
    const promise = isEdit 
      ? updateInventario(data.id, data) 
      : createInventario(data);

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
    const almacen = inventarios.find(i => i.id === row.id);
    if (!almacen) return;
    setDeleteAlmacen(almacen);
  }

  function confirmDelete() {
    if (!deleteAlmacen) return;
    setLoading(true);
    
    srvDeleteInventario(deleteAlmacen.id)
      .then(() => {
        setDeleteAlmacen(null);
        cargar();
      })
      .catch(e => {
        if (e.message.includes("constraint")) {
          setError("No se puede eliminar un almacén que ya tiene movimientos de inventario.");
        } else {
          setError(e.message);
        }
      })
      .finally(() => setLoading(false));
  }

  // Mapeamos los datos para la tabla
  const rows = inventarios.map(i => ({
    id: i.id,
    codigo: i.codigo,
    estado: i.estado,
    fecha_creacion: new Date(i.fecha_creacion).toLocaleString()
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <InventarioForm
          initialInventario={editing}
          onSubmit={saveInventario}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && (
        <div 
          className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm cursor-pointer"
          onClick={() => setError(null)}
        >
          {error}
        </div>
      )}

      <SmartTable
        titulo="Almacenes / Inventarios"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "codigo", label: "Código", enableSort: true },
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
          },
          { key: "fecha_creacion", label: "Fecha Creación", enableSort: true },
        ]}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteAlmacen}
        title="Eliminar Almacén"
        message={`¿Seguro que deseas eliminar el almacén "${deleteAlmacen?.codigo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlmacen(null)}
      />
    </div>
  );
}