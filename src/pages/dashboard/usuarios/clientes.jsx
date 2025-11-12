import { useEffect, useState, useMemo, useRef } from "react";
import { 
  getClientes, 
  createCliente, 
  updateCliente, 
  deleteCliente as apiDeleteCliente,
} from "../../../services/cliente.service.js";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import ClienteForm from "../../../components/dashboard/ClienteForm.jsx";
import ConfirmDialog from "../../../components/ui/dialogo.jsx";
import { FaSearch, FaSpinner } from 'react-icons/fa';

export default function ClientesPage() {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteCliente, setDeleteCliente] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const isInitialMount = useRef(true);

  // Cargar Datos (Live Search)
  const cargar = (searchQuery = "") => {
    if (searchQuery === "") setLoading(true);
    setError("");
    
    getClientes(searchQuery)
      .then(data => setClientes(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message))
      .finally(() => { if (searchQuery === "") setLoading(false); });
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      cargar("");
    } else {
      const timerId = setTimeout(() => cargar(searchTerm), 300);
      return () => clearTimeout(timerId);
    }
  }, [searchTerm]);

  // --- Funciones CRUD ---

  function onCreate() {
    setEditing(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onEdit(row) {
    setEditing(row); 
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveCliente(formData) {
    setLoading(true);
    setError("");

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      telefono: formData.telefono,
      is_active: formData.is_active,
      rol: 'CLIENTE',
      cliente: {
        ciudad: formData.ciudad || '',
        codigo_postal: formData.codigo_postal || ''
      }
    };
    
    if (!formData.id && formData.password) payload.password = formData.password;
    if (formData.id && formData.password) payload.password = formData.password;

    try {
      if (formData.id) {
        await updateCliente(formData.id, payload);
      } else {
        await createCliente(payload);
      }
      setShowForm(false);
      setEditing(null);
      cargar(searchTerm); 
    } catch (e) {
      if (e.status === 400 && e.data) {
        // Manejo de errores de validación (ej. correo duplicado)
        const errorMsg = Object.entries(e.data)
          // 'cliente' puede ser un error anidado, lo aplanamos
          .map(([key, value]) => {
            if (key === 'cliente') {
              return Object.entries(value).map(([k, v]) => `${k}: ${v.join(', ')}`).join('; ');
            }
            return `${key}: ${value.join(', ')}`;
          })
          .join('; ');
        setError(errorMsg || "Error de validación.");
      } else {
        setError(e.message || "Error al guardar");
      }
    } finally {
      setLoading(false);
    }
  }

  function onDelete(row) {
    setDeleteCliente(row);
  }

  async function confirmDelete() {
    if (!deleteCliente) return;
    setLoading(true);
    try {
      await apiDeleteCliente(deleteCliente.id);
      setDeleteCliente(null);
      cargar(searchTerm); 
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }


  const columns = useMemo(() => [
    { key: "id", label: "ID", width: "60px", enableSort: true },
    { 
      key: "nombre", 
      label: "Nombre", 
      enableSort: true,
      render: (row) => `${row.nombre || ''} ${row.apellido || ''}`
    },
    { key: "correo", label: "Correo", enableSort: true },
    { 
      key: "ciudad",
      label: "Ciudad",
      render: (clienteData) => clienteData.ciudad || 'N/A'
    },
  ], []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Gestión de Clientes
      </h1>

      {showForm && (
        <ClienteForm
          initialCliente={editing} 
          onSubmit={saveCliente}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          loading={loading}
        />
      )}

      {error && (
        <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo, ciudad..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Crear Cliente
        </button>
      </div>

      <SmartTable
        titulo="Clientes Registrados"
        data={clientes}
        loading={loading}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ConfirmDialog
        open={!!deleteCliente}
        title="Eliminar Cliente"
        message={`¿Seguro que deseas eliminar al cliente "${deleteCliente?.nombre} ${deleteCliente?.apellido}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCliente(null)}
      />
    </div>
  );
}