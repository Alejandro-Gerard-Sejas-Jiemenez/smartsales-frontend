import { useEffect, useState } from "react";
import SmartTable from "../../../components/tabla/SmartTable.jsx";
import IngresoForm from "../../../components/dashboard/IngresoForm.jsx";
import {
  getIngresos,
  createIngreso,
  getInventarios,
  getProductos
} from "../../../services/catalogo.service.js";

export default function IngresosPage() {
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [ingresos, setIngresos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Estados para los catálogos que necesita el formulario
  const [inventarios, setInventarios] = useState([]);
  const [productos, setProductos] = useState([]);

  const [error, setError] = useState("");

  // Carga el historial de ingresos
  function cargarIngresos() {
    setLoading(true);
    setError("");
    getIngresos()
      .then((data) => {
        setIngresos(Array.isArray(data) ? data : []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  // Carga los catálogos para el formulario (solo una vez)
  function cargarCatalogos() {
    setLoadingCatalogs(true);
    Promise.all([
      getInventarios(),
      getProductos()
    ])
    .then(([invData, prodData]) => {
      setInventarios(Array.isArray(invData) ? invData : []);
      setProductos(Array.isArray(prodData) ? prodData : []);
    })
    .catch(e => setError("Error cargando catálogos para el formulario: " + e.message))
    .finally(() => setLoadingCatalogs(false));
  }

  // Carga inicial
  useEffect(() => { 
    cargarIngresos();
    cargarCatalogos();
  }, []);

  // Botón "Registrar Ingreso"
  function onCreate() {
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Guardar (solo crear)
  function saveIngreso(data) {
    setLoading(true);
    
    // Llamamos al servicio 'createIngreso'
    // El 'data' ya viene listo del formulario
    // Ej: { inventario: 1, producto_id: 5, cantidad: 10 }
    createIngreso(data)
      .then(() => {
        setShowForm(false);
        cargarIngresos(); // Recargamos el historial
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const rows = ingresos.map(i => ({
    id: i.id,
    fecha_ingreso: new Date(i.fecha_ingreso).toLocaleString(),
    codigo_almacen: i.inventario_codigo || "N/A",
    producto_nombre: i.producto?.nombre || "N/A",
    cantidad: i.cantidad
  }));

  return (
    <div className="space-y-8">
      {showForm && (
        <IngresoForm
          inventarios={inventarios}
          productos={productos}
          onSubmit={saveIngreso}
          onCancel={() => { setShowForm(false); }}
          loading={loading || loadingCatalogs}
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
        titulo="Historial de Ingresos de Stock"
        data={rows}
        loading={loading}
        columns={[
          { key: "id", label: "ID", width: "70px", enableSort: true },
          { key: "fecha_ingreso", label: "Fecha y Hora", enableSort: true },
          { key: "producto_nombre", label: "Producto", enableSort: true },
          { key: "cantidad", label: "Cantidad Ingresada", enableSort: true },
          { key: "codigo_almacen", label: "Almacén", enableSort: true },
        ]}
        onCreate={onCreate}
        onCreateText="Registrar Ingreso"
      />
    </div>
  );
}