// src/pages/dashboard/ventas/HistorialVentas.jsx

import { useEffect, useState, useMemo } from "react";
import { getVentas, getComprobanteVenta } from "../../../services/venta.service.js";
import { getClientes } from "../../../services/cliente.service.js";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import toast from 'react-hot-toast';

// Componente Field
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

export default function HistorialVentasPage() {
  const [loading, setLoading] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]); // Para el dropdown de filtro
  const [error, setError] = useState("");

  // Estado para todos los filtros
  const [filters, setFilters] = useState({
    fecha_min: '',
    fecha_max: '',
    cliente: '',
    metodo_entrada: ''
  });
  
  const handleGenerarComprobante = async (ventaId) => {
    toast.loading('Generando PDF...'); // Muestra "Cargando..."
    try {
      const blob = await getComprobanteVenta(ventaId);

      // Crear una URL temporal para el archivo
      const fileURL = URL.createObjectURL(blob);

      // Crear un enlace <a> fantasma para iniciar la descarga
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `nota_venta_${ventaId}.pdf`); // Nombre del archivo
      document.body.appendChild(link);
      link.click();

      // Limpiar
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(fileURL);
      toast.dismiss(); // Quita el "Cargando..."
      toast.success("Comprobante descargado.");

    } catch (e) {
      toast.dismiss();
      toast.error("Error al descargar el PDF: " + e.message);
    }
  };

  // Cargar Clientes (solo una vez)
  useEffect(() => {
    getClientes()
      .then(cliData => setClientes(Array.isArray(cliData) ? cliData : []))
      .catch(e => setError("Error al cargar clientes: " + e.message));
  }, []);

  // Cargar Ventas (cada vez que los filtros cambien)
  useEffect(() => {
    cargarVentas();
  }, [filters]);

  const cargarVentas = () => {
    setLoading(true);
    setError("");

    // Prepara los params para la API (elimina filtros vacíos)
    const params = {};
    if (filters.fecha_min) params.fecha_min = filters.fecha_min;
    if (filters.fecha_max) params.fecha_max = filters.fecha_max;
    if (filters.cliente) params.cliente = filters.cliente;
    if (filters.metodo_entrada) params.metodo_entrada = filters.metodo_entrada;

    getVentas(params)
      .then(data => setVentas(Array.isArray(data) ? data : []))
      .catch(e => setError("Error al cargar historial: " + e.message))
      .finally(() => setLoading(false));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Definimos las columnas para SmartTable
  const columns = useMemo(() => [
    { key: "id", label: "ID Venta", width: "80px", enableSort: true },
    { 
      key: "fecha_venta", 
      label: "Fecha", 
      enableSort: true,
      render: (row) => new Date(row.fecha_venta).toLocaleString()
    },
    { 
      key: "cliente", 
      label: "Cliente",
      render: (row) => row.cliente?.correo || 'N/A'
    },
    { 
      key: "total", 
      label: "Total (Bs)", 
      enableSort: true,
      render: (row) => parseFloat(row.total).toFixed(2)
    },
    { key: "metodo_entrada", label: "Método", enableSort: true },
    { 
      key: "detalles", 
      label: "Items",
      render: (row) => row.detalles?.length || 0
    },
    {
      key: "opciones",
      label: "Descargar",
      width: "100px", // Ajusta el ancho
      render: (row) => (
        <button
          onClick={() => handleGenerarComprobante(row.id)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
          title="Generar Nota de Venta (PDF)"
        >
          PDF
        </button>
      )
    }

  ], []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Historial de Ventas
      </h1>

      {/* --- Barra de Filtros --- */}
      <div className="p-6 space-y-4 border rounded-3xl bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Field label="Fecha Desde">
            <input
              type="date"
              name="fecha_min"
              value={filters.fecha_min}
              onChange={handleFilterChange}
              className="input-base"
            />
          </Field>
          <Field label="Fecha Hasta">
            <input
              type="date"
              name="fecha_max"
              value={filters.fecha_max}
              onChange={handleFilterChange}
              className="input-base"
            />
          </Field>
          <Field label="Cliente">
            <select
              name="cliente"
              value={filters.cliente}
              onChange={handleFilterChange}
              className="input-base"
            >
              <option value="">Todos los clientes</option>
              {clientes
                .filter(cli => cli.cliente_id != null) // <-- Añade este filtro
                .map(cli => (
                <option key={cli.cliente_id} value={cli.cliente_id}>
                  {cli.nombre} {cli.apellido}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Método de Venta">
            <select
              name="metodo_entrada"
              value={filters.metodo_entrada}
              onChange={handleFilterChange}
              className="input-base"
            >
              <option value="">Todos los métodos</option>
              <option value="Mostrador">Mostrador</option>
              <option value="Telefono">Teléfono</option>
              <option value="Móvil">Móvil (App)</option>
            </select>
          </Field>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* --- Tabla de Resultados --- */}
      <SmartTable
        titulo="Ventas Registradas"
        data={ventas}
        loading={loading}
        columns={columns}
        // No hay onCreate, onEdit, onDelete para el historial
      />
    </div>
  );
}