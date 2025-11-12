import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import { api } from "../../../services/apiClient.js";
import AccountForm from "../../../components/dashboard/UsuariosForm.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";

export default function CuentasPage() {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [error, setError] = useState("");

  function cargar() {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/api/acceso_seguridad/usuarios/"),
    ])
      .then(([u, r, res, per]) => {
        setUsuarios(Array.isArray(u) ? u : []);
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
    const user = usuarios.find(u => u.id === row.id);
    if (!user) return;
    setEditing(user);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Guardar (crear/editar)
  function saveUser(data) {
    setLoading(true);
    const isEdit = !!data.id;
    console.log('Payload enviado al backend:', data);
    const url = isEdit ? `/api/acceso_seguridad/usuarios/${data.id}/` : "/api/acceso_seguridad/usuarios/";
    const method = isEdit ? api.put : api.post;
    method(url, data)
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
    const user = usuarios.find(u => u.id === row.id);
    if (!user) return;
    setDeleteUser(user);
  }

  function confirmDelete() {
    if (!deleteUser) return;
    setLoading(true);
    api.del(`/api/acceso_seguridad/usuarios/${deleteUser.id}/`)
      .then(() => {
        setDeleteUser(null);
        cargar();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = usuarios.map(u => ({
  id: u.id,
  correo: u.correo,
  nombre_completo: `${u.nombre || ''} ${u.apellido || ''}`.trim() || '—',
  activo: u.is_active,
  rol: u.rol ? u.rol : "—"
  }));


  return (
    <div className="space-y-8">
      {showForm && (
        <AccountForm
          initialUser={editing}
          roles={roles}
          onSubmit={saveUser}
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
        titulo="Usuarios"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "nombre_completo", label: "Nombre Completo", enableSort: true },
          { key: "correo", label: "Correo", enableSort: true },
          { key: "rol", label: "Rol", hideBelow: "md" },
          {
            key: "activo",
            label: "Estado",
            render: (row) => (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  row.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
              >
                {row.activo ? "Activo" : "Inactivo"}
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
        open={!!deleteUser}
        title="Eliminar Usuario"
        message={`¿Seguro que deseas eliminar "${deleteUser?.correo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteUser(null)}
      />
    </div>
  );
}